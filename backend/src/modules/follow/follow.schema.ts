import { z } from "zod";

// ─── Follow Input (POST /api/v1/follows) ─────────────────────

/**
 * Validates the request body for following a manga.
 *
 * `mangaId` is the MangaDex source UUID — the backend uses this to
 * look up or upsert the local Manga record before creating the
 * UserFollow relation.
 */
export const followInputSchema = z.object({
  mangaId: z
    .string({ required_error: "mangaId is required" })
    .uuid("mangaId must be a valid MangaDex UUID"),
});

export type FollowInput = z.infer<typeof followInputSchema>;

// ─── Progress Input (PATCH /api/v1/follows/:mangaId/progress) ─

/**
 * Validates the request body for updating reading progress.
 *
 * `lastReadChapter` is stored as a string to accommodate
 * non-numeric chapter identifiers (e.g. "12.5", "extra-1").
 */
export const progressInputSchema = z.object({
  lastReadChapter: z
    .string({ required_error: "lastReadChapter is required" })
    .min(1, "lastReadChapter must not be empty")
    .max(50, "lastReadChapter must be 50 characters or fewer")
    .transform((v) => v.trim()),
});

export type ProgressInput = z.infer<typeof progressInputSchema>;

// ─── Manga ID Param (route :mangaId) ─────────────────────────

/**
 * Validates the `:mangaId` route parameter.
 * MangaDex uses UUID v4 identifiers.
 */
export const followMangaIdParamSchema = z.object({
  mangaId: z
    .string()
    .uuid("Invalid manga ID format — expected a UUID"),
});

export type FollowMangaIdParam = z.infer<typeof followMangaIdParamSchema>;
