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
 * Lazily resolved secret key encoded as Uint8Array for HMAC-SHA256.
 * Throws on startup if the env var is missing — fail-fast by design.
 */
function getSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error(
      "JWT_SECRET must be set in the environment and be at least 32 characters long."
    );
  }
  return new TextEncoder().encode(raw);
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
    .sign(getSecret());
}

/**
 * Longer-lived refresh token (7 days).
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
    .sign(getSecret());
}

// ─── Verification ────────────────────────────────────────────

/**
 * Verifies a token and returns the typed payload.
 * Callers MUST check `payload.type` to prevent token-type confusion attacks.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: "kiroku",
    audience: "kiroku-client",
  });

  return payload as TokenPayload;
}
