import { z } from "zod";

// ─── Search Query ────────────────────────────────────────────

/**
 * Validates query parameters for `GET /api/v1/manga?q=...`.
 *
 * All params arrive as strings from Express, so we use `z.coerce`
 * for numeric fields and `.transform()` for sanitisation.
 *
 * Defaults:
 *  - limit:  10 (sensible page size for search-bar dropdowns)
 *  - offset: 0
 */
export const searchQuerySchema = z.object({
  q: z
    .string({ required_error: "Search query 'q' is required" })
    .min(1, "Search query must not be empty")
    .max(200, "Search query must be 200 characters or fewer")
    .transform((v) => v.trim()),

  limit: z.coerce
    .number()
    .int("limit must be an integer")
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100")
    .default(10),

  offset: z.coerce
    .number()
    .int("offset must be an integer")
    .min(0, "offset must be 0 or greater")
    .default(0),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

// ─── Chapters Query ──────────────────────────────────────────

/**
 * Validates query parameters for `GET /api/v1/manga/:id/chapters`.
 *
 * Defaults:
 *  - limit:    100
 *  - offset:   0
 *  - language: "en"
 */
export const chaptersQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int("limit must be an integer")
    .min(1, "limit must be at least 1")
    .max(500, "limit must be at most 500")
    .default(100),

  offset: z.coerce
    .number()
    .int("offset must be an integer")
    .min(0, "offset must be 0 or greater")
    .default(0),

  language: z
    .string()
    .min(2, "language must be a valid ISO 639-1 code")
    .max(5, "language must be a valid ISO 639-1 code")
    .default("en"),
});

export type ChaptersQueryInput = z.infer<typeof chaptersQuerySchema>;

// ─── Manga ID Param ──────────────────────────────────────────

/**
 * Validates the `:id` route parameter for manga detail / chapter routes.
 * MangaDex uses UUID v4 identifiers.
 */
export const mangaIdParamSchema = z.object({
  id: z.string().uuid("Invalid manga ID format — expected a UUID"),
});

export type MangaIdParam = z.infer<typeof mangaIdParamSchema>;
