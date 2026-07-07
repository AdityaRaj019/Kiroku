// Load environment variables FIRST — must run before any module
// that reads process.env (e.g. prisma.ts needs DATABASE_URL).
import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { prisma } from "./utils/prisma";
import { connectRedis, disconnectRedis } from "./utils/redis";
import { verifyToken } from "./utils/jwt";
import { authRouter } from "./modules/auth/auth.routes";
import { mangaRouter } from "./modules/manga/manga.routes";
import { libraryRouter } from "./modules/library/library.routes";
import { userRouter } from "./modules/user/user.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
const server = http.createServer(app);

// ─── CORS origin resolution ─────────────────────────────────

/**
 * Parses FRONTEND_URL into a single origin string or an array.
 * Supports comma-separated values for multi-origin setups
 * (e.g. production + Vercel preview deploys).
 */
function parseCorsOrigins(): string | string[] {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  const origins = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

const corsOrigins = parseCorsOrigins();

// ─── Security hardening ─────────────────────────────────────

// Helmet sets secure HTTP headers. CSP is explicitly configured
// for a pure REST API that only serves JSON — blocks everything
// except same-origin to prevent misuse if HTML is accidentally served.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

// Disable X-Powered-By to avoid advertising the tech stack
app.disable("x-powered-by");

// ─── Rate Limiting (aligned with PRD §14.2) ──────────────────

// Global rate limiter — 60 requests per minute per IP (PRD §14.2)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(globalLimiter);

// Auth endpoints — 5 requests per minute per IP (PRD §14.2)
// Strict burst control to prevent brute-force login attempts.
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later" },
});

// Search-specific rate limiter — 30 requests per minute.
// Generous enough for real browsing but prevents runaway search-bar
// spam from a single IP. Frontend should also debounce (300-500ms).
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many search requests, please try again later" },
});

// Library endpoints rate limiter — 60 requests per minute per IP
const libraryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many library requests, please try again later" },
});

// ─── Body parsing & cookies ─────────────────────────────────

app.use(express.json({ limit: "10kb" })); // cap body size to prevent payload bombs
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── CORS ────────────────────────────────────────────────────

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

// ─── Routes ──────────────────────────────────────────────────

// Auth routes with tighter rate-limiting
app.use("/api/v1/auth", authLimiter, authRouter);

// Scope search-specific rate-limiting ONLY to the GET search endpoint
app.get("/api/v1/manga", searchLimiter);
app.use("/api/v1/manga", mangaRouter);

// Library routes (rate limited)
app.use("/api/v1/library", libraryLimiter, libraryRouter);

// User routes (rate limited)
app.use("/api/v1/users", libraryLimiter, userRouter);

// Health check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const safeError =
      process.env.NODE_ENV === "production"
        ? "Database connection failed"
        : error instanceof Error
        ? error.message
        : "Unknown database error";

    res.status(500).json({
      status: "degraded",
      database: "disconnected",
      error: safeError,
    });
  }
});

// ─── Socket.IO (authenticated connections only) ──────────────

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/**
 * Socket.IO authentication middleware.
 *
 * Clients must pass their JWT access token during the handshake:
 *   io("ws://...", { auth: { token: "<access_token>" } })
 *
 * Unauthenticated connections are rejected before the "connection"
 * event fires, preventing unauthorized room joins or broadcasts.
 *
 * @see PRD §14.1 — "Socket.io connections authenticate by requiring
 * a handshake parameter verification containing the client JWT token."
 */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const payload = await verifyToken(token);

    if (payload.type !== "access") {
      return next(new Error("Invalid token type"));
    }

    // Attach user data to socket for downstream use
    socket.data.user = payload;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.user?.sub as string;

  // Auto-join the user's personal notification room.
  // Server-side code can emit to `user:<id>` to push notifications.
  socket.join(`user:${userId}`);

  socket.on("disconnect", () => {
    // Cleanup if needed (e.g. presence tracking in the future)
  });
});

// ─── Global error handler (must be last) ─────────────────────

app.use(errorMiddleware);

// ─── Graceful shutdown ───────────────────────────────────────

/**
 * Drains all connections on SIGTERM/SIGINT to prevent:
 * - PostgreSQL connection pool leaks on Railway deploys
 * - Redis connection exhaustion across restarts
 * - Abrupt termination of in-flight HTTP requests
 */
async function shutdown(signal: string): Promise<void> {
  console.log(`\n[Shutdown] ${signal} received. Closing connections…`);

  // 1. Stop accepting new connections
  server.close(() => {
    console.log("[Shutdown] HTTP server closed.");
  });

  // 2. Close Socket.IO
  io.close();

  // 3. Disconnect Prisma (drain connection pool)
  try {
    await prisma.$disconnect();
    console.log("[Shutdown] Prisma disconnected.");
  } catch (err) {
    console.error(
      "[Shutdown] Prisma disconnect error:",
      err instanceof Error ? err.message : err
    );
  }

  // 4. Disconnect Redis
  try {
    await disconnectRedis();
    console.log("[Shutdown] Redis disconnected.");
  } catch (err) {
    console.error(
      "[Shutdown] Redis disconnect error:",
      err instanceof Error ? err.message : err
    );
  }

  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Process-level crash guards ──────────────────────────────

process.on("unhandledRejection", (reason) => {
  console.error("[Process] Unhandled rejection:", reason);
  // Do NOT exit — let the event loop continue.
  // In production, this should be piped to Sentry.
});

process.on("uncaughtException", (err) => {
  console.error("[Process] Uncaught exception:", err);
  // Uncaught exceptions leave the process in an undefined state.
  // Exit and let the container orchestrator (Railway) restart.
  process.exit(1);
});

// ─── Server startup ──────────────────────────────────────────

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
  // Connect to Redis in the background so it doesn't block server startup
  connectRedis().catch((err) => {
    console.error(
      "[Bootstrap] Redis connection failed:",
      err instanceof Error ? err.message : err
    );
  });

  server.listen(PORT, () => {
    console.log(`Kiroku server is running on port ${PORT}`);
    console.log(`[Env] NODE_ENV: "${process.env.NODE_ENV}", FRONTEND_URL: "${process.env.FRONTEND_URL}"`);
  });
}

bootstrap();
