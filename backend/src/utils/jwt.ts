import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { randomUUID } from "node:crypto";

// ─── Types ───────────────────────────────────────────────────

export interface TokenPayload extends JWTPayload {
  /** User primary key */
  sub: string;
  /** Token type discriminator */
  type: "access" | "refresh";
}

// ─── Secret management ──────────────────────────────────────

/**
 * Lazily resolved access-token secret encoded as Uint8Array for HMAC-SHA256.
 * Throws on startup if the env var is missing — fail-fast by design.
 */
function getAccessSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error(
      "JWT_SECRET must be set in the environment and be at least 32 characters long."
    );
  }
  return new TextEncoder().encode(raw);
}

/**
 * Separate secret for refresh tokens.
 *
 * Using a distinct key means a compromised access-token secret does NOT
 * automatically compromise all refresh tokens (and vice versa).
 * Falls back to JWT_SECRET only in development for convenience.
 */
function getRefreshSecret(): Uint8Array {
  const raw = process.env.JWT_REFRESH_SECRET;

  if (process.env.NODE_ENV === "production" && (!raw || raw.length < 32)) {
    throw new Error(
      "JWT_REFRESH_SECRET must be set in production and be at least 32 characters long."
    );
  }

  // Dev fallback: use JWT_SECRET if JWT_REFRESH_SECRET is not set
  const secret = raw && raw.length >= 32 ? raw : process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_REFRESH_SECRET (or JWT_SECRET as dev fallback) must be at least 32 characters long."
    );
  }

  return new TextEncoder().encode(secret);
}

// ─── Token generation ────────────────────────────────────────

/**
 * Short-lived access token (15 minutes).
 * Contains only the user id — no sensitive data in the payload.
 */
export async function generateAccessToken(userId: number): Promise<string> {
  return new SignJWT({ type: "access" } satisfies Partial<TokenPayload>)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("kiroku")
    .setAudience("kiroku-client")
    .setJti(randomUUID())
    .sign(getAccessSecret());
}

/**
 * Longer-lived refresh token (7 days).
 * Signed with a **separate** secret to limit blast radius if one key leaks.
 * Used exclusively via HTTP-only cookie — never exposed to JS.
 */
export async function generateRefreshToken(userId: number): Promise<string> {
  return new SignJWT({ type: "refresh" } satisfies Partial<TokenPayload>)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("7d")
    .setIssuer("kiroku")
    .setAudience("kiroku-client")
    .setJti(randomUUID())
    .sign(getRefreshSecret());
}

// ─── Verification ────────────────────────────────────────────

/**
 * Verifies an **access** token and returns the typed payload.
 * Callers MUST check `payload.type` to prevent token-type confusion attacks.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret(), {
    issuer: "kiroku",
    audience: "kiroku-client",
  });

  return payload as TokenPayload;
}

/**
 * Verifies a **refresh** token using the dedicated refresh secret.
 * Used exclusively in the token-rotation flow.
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret(), {
    issuer: "kiroku",
    audience: "kiroku-client",
  });

  return payload as TokenPayload;
}
