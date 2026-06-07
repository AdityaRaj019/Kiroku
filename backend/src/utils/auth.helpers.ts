import { AppError } from "../middlewares/error.middleware";

/**
 * Safely parses a JWT `sub` claim into a numeric user ID.
 *
 * Guards against:
 * - Missing or undefined `sub` claims
 * - Non-numeric strings (e.g. corrupted tokens)
 * - Fractional values (user IDs are always integers)
 * - Negative or zero values
 *
 * Throws AppError(401) on any invalid input, producing a clean
 * HTTP response instead of a cryptic Prisma / PostgreSQL error.
 */
export function parseUserId(sub: string | undefined): number {
  if (!sub) {
    throw new AppError(401, "Authentication required");
  }

  const id = Number(sub);

  if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
    throw new AppError(401, "Invalid user identity");
  }

  return id;
}
