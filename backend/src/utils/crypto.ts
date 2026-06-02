import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

// ─── Why pre-hash? ──────────────────────────────────────────
// bcrypt silently truncates passwords longer than 72 bytes.
// By SHA-256 pre-hashing we get a fixed 64-hex-char input,
// avoiding truncation while preserving entropy.
// ─────────────────────────────────────────────────────────────

/**
 * Deterministic SHA-256 pre-hash → bcrypt hash.
 * Returns the bcrypt-hashed string ready for database storage.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  const sha256Hex = createHash("sha256").update(plaintext).digest("hex");
  return bcrypt.hash(sha256Hex, BCRYPT_ROUNDS);
}

/**
 * Constant-time comparison of a plaintext password against a stored hash.
 */
export async function comparePassword(
  plaintext: string,
  storedHash: string
): Promise<boolean> {
  const sha256Hex = createHash("sha256").update(plaintext).digest("hex");
  return bcrypt.compare(sha256Hex, storedHash);
}

/**
 * Hash a refresh token with SHA-256 for database storage.
 * We never store raw refresh tokens — only their hash — so a DB leak
 * does not directly expose active sessions.
 */
export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
