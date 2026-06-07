import type { Request, Response, NextFunction } from "express";
import { verifyToken, type TokenPayload } from "../utils/jwt";

// ─── Augment Express Request ─────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      /** Populated by authMiddleware after successful token verification. */
      user?: TokenPayload;
    }
  }
}

// ─── Middleware ───────────────────────────────────────────────

/**
 * Verifies the Bearer access-token from the Authorization header.
 *
 * Security checks performed:
 * 1. Header presence & format
 * 2. Signature & expiration (via jose)
 * 3. Token-type claim — only "access" tokens are accepted, preventing
 *    misuse of refresh tokens as bearer credentials.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or malformed Authorization header" });
      return;
    }

    const token = header.slice(7); // strip "Bearer "

    if (!token) {
      res.status(401).json({ error: "Token not provided" });
      return;
    }

    const payload = await verifyToken(token);

    // Prevent token-type confusion: only access tokens are valid here
    if (payload.type !== "access") {
      res.status(401).json({ error: "Invalid token type" });
      return;
    }

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Optional authentication — enriches the request with user data if a valid
 * token is present, but does NOT reject unauthenticated requests.
 *
 * Use this on public routes where behaviour differs for logged-in users
 * (e.g. showing tracking status on the manga detail page for logged-in
 * users while still allowing guests to browse freely).
 */
export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = header.slice(7);
    if (!token) {
      next();
      return;
    }

    const payload = await verifyToken(token);

    if (payload.type === "access") {
      req.user = payload;
    }
  } catch {
    // Token invalid or expired — treat as unauthenticated guest
  }

  next();
}
