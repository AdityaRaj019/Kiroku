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
import { authRouter } from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
const server = http.createServer(app);

// ─── Security hardening ─────────────────────────────────────

// Helmet sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options,
// Strict-Transport-Security, etc.) to protect against common web attacks.
app.use(helmet());

// Disable X-Powered-By to avoid advertising the tech stack
app.disable("x-powered-by");

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(globalLimiter);

// Stricter rate limiter for auth endpoints — 20 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later" },
});

// ─── Body parsing & cookies ─────────────────────────────────

app.use(express.json({ limit: "10kb" })); // cap body size to prevent payload bombs
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── CORS ────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ─── Routes ──────────────────────────────────────────────────

// Auth routes with tighter rate-limiting
app.use("/api/v1/auth", authLimiter, authRouter);

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
    res.status(500).json({
      status: "degraded",
      database: "disconnected",
      error:
        error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

// ─── Socket.IO ───────────────────────────────────────────────

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    const { room, message } = data;
    io.to(room).emit("receive_message", {
      sender: socket.id,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ─── Global error handler (must be last) ─────────────────────

app.use(errorMiddleware);

// ─── Server startup ──────────────────────────────────────────

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Kiroku server is running on port ${PORT}`);
});
