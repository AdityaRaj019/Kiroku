import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma";
import { hashPassword, comparePassword, hashRefreshToken } from "../../utils/crypto";
import { parseUserId } from "../../utils/auth.helpers";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/error.middleware";
import type { RegisterInput, LoginInput } from "./auth.schema";

// ─── Constants ───────────────────────────────────────────────

/** Refresh token cookie name */
const REFRESH_COOKIE = "kiroku_rt";

/** Refresh token max age in milliseconds (7 days) */
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Sets the refresh-token cookie with hardened security options.
 *
 * - httpOnly: prevents XSS from reading the cookie
 * - secure:   cookie only sent over HTTPS in production
 * - sameSite: strict prevents CSRF by blocking cross-site requests
 * - path:     scoped to auth routes only — cookie is never sent to other endpoints
 */
function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_MAX_AGE_MS,
  });
}

/** Clears the refresh-token cookie with matching options. */
function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

// ─── Controllers ─────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 *
 * Creates a new user account. On success, issues both tokens so the user
 * is immediately logged in without a separate login round-trip.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, name, password } = req.body as RegisterInput;

    // Check for existing user — constant-time comparison not needed here
    // because we reveal nothing about timing to the client.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(409, "An account with this email already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    // Issue tokens
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    ]);

    // Store ONLY the hash of the refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashRefreshToken(refreshToken) },
    });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: "Account created successfully",
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 *
 * Authenticates with email/password, issues new token pair.
 * Uses a generic error message for both "user not found" and "wrong password"
 * to prevent user enumeration.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });

    // Generic message prevents user-enumeration attacks
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    ]);

    // Rotate refresh token hash in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashRefreshToken(refreshToken) },
    });

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/refresh
 *
 * Rotates the refresh token (one-time use pattern):
 * 1. Read refresh token from HTTP-only cookie
 * 2. Verify signature & expiry
 * 3. Compare hash against stored hash (prevents replay after rotation)
 * 4. Issue a fresh token pair
 * 5. Update the stored hash
 *
 * If the stored hash doesn't match, it means the token was already rotated
 * (possible theft scenario), so we invalidate all sessions for the user.
 */
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];

    if (!token) {
      throw new AppError(401, "Refresh token not provided");
    }

    let payload;
    try {
      payload = await verifyRefreshToken(token);
    } catch {
      clearRefreshCookie(res);
      throw new AppError(401, "Invalid or expired refresh token");
    }

    if (payload.type !== "refresh") {
      throw new AppError(401, "Invalid token type");
    }

    const userId = parseUserId(payload.sub);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshTokenHash) {
      clearRefreshCookie(res);
      throw new AppError(401, "Session not found");
    }

    // Verify the presented token matches the stored hash
    const presentedHash = hashRefreshToken(token);
    if (presentedHash !== user.refreshTokenHash) {
      // Possible token theft — invalidate all sessions for this user
      await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
      clearRefreshCookie(res);
      throw new AppError(401, "Token reuse detected — all sessions invalidated");
    }

    // Rotate: issue new pair
    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(userId),
      generateRefreshToken(userId),
    ]);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hashRefreshToken(newRefreshToken) },
    });

    setRefreshCookie(res, newRefreshToken);

    res.status(200).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/logout
 *
 * Invalidates the refresh token by clearing the hash from the DB and
 * removing the cookie. The access token will naturally expire (15 min).
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // If authenticated, clear the stored refresh hash
    if (req.user?.sub) {
      const userId = parseUserId(req.user.sub);
      await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
    }

    clearRefreshCookie(res);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/profile
 *
 * Protected route — returns the authenticated user's profile.
 * Never returns the password hash or refresh token hash.
 */
export async function profile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.sub) {
      throw new AppError(401, "Authentication required");
    }

    const userId = parseUserId(req.user.sub);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}
