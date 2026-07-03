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

// ─── Showcase Query ──────────────────────────────────────────

/**
 * Validates query parameters for `GET /api/v1/manga/showcase`.
 */
export const showcaseQuerySchema = z.object({
  trendingPeriod: z.enum(["day", "month", "year"]).default("day"),
});

export type ShowcaseQueryInput = z.infer<typeof showcaseQuerySchema>;

// ─── Advanced Search Query (Task 03) ─────────────────────────

const MangaFormatEnum = z.enum([
  "MANGA",
  "MANHWA",
  "MANHUA",
  "COMIC",
  "ONE_SHOT",
  "DOUJINSHI",
]);

/**
 * Splits a comma-separated query string value into a trimmed string array.
 * Returns undefined when the input is empty or missing.
 */
function splitCommaSeparated(value: string | undefined): string[] | undefined {
  if (!value || value.trim() === "") return undefined;
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

/**
 * Validates query parameters for `GET /api/v1/manga/search`.
 *
 * All filter params are optional — callers can combine any subset.
 * Comma-separated string params (genres, readingOn, streamingOn) are
 * split into arrays. Numeric range params are coerced from query strings.
 *
 * The frontend should debounce filter changes (300-500ms) so that
 * multiple rapid filter clicks resolve into a single API call.
 *
 * Defaults:
 *  - page:  1
 *  - limit: 20 (max 100)
 */
export const advancedSearchQuerySchema = z
  .object({
    q: z
      .string()
      .max(200, "Search query must be 200 characters or fewer")
      .transform((v) => v.trim())
      .optional(),

    genres: z.string().optional().transform(splitCommaSeparated),

    format: z
      .string()
      .optional()
      .transform((v) => (v ? v.toUpperCase() : undefined))
      .pipe(MangaFormatEnum.optional()),

    country: z
      .string()
      .max(10, "country must be 10 characters or fewer")
      .optional()
      .transform((v) => v?.trim()),

    year: z.coerce
      .number()
      .int("year must be an integer")
      .min(1900, "year must be 1900 or later")
      .max(2100, "year must be 2100 or earlier")
      .optional(),

    sourceMaterial: z
      .string()
      .max(100, "sourceMaterial must be 100 characters or fewer")
      .optional()
      .transform((v) => v?.trim()),

    minChapters: z.coerce
      .number()
      .int("minChapters must be an integer")
      .min(0, "minChapters must be 0 or greater")
      .optional(),

    maxChapters: z.coerce
      .number()
      .int("maxChapters must be an integer")
      .min(0, "maxChapters must be 0 or greater")
      .optional(),

    minEpisodes: z.coerce
      .number()
      .int("minEpisodes must be an integer")
      .min(0, "minEpisodes must be 0 or greater")
      .optional(),

    maxEpisodes: z.coerce
      .number()
      .int("maxEpisodes must be an integer")
      .min(0, "maxEpisodes must be 0 or greater")
      .optional(),

    readingOn: z.string().optional().transform(splitCommaSeparated),

    streamingOn: z.string().optional().transform(splitCommaSeparated),

    page: z.coerce
      .number()
      .int("page must be an integer")
      .min(1, "page must be at least 1")
      .default(1),

    limit: z.coerce
      .number()
      .int("limit must be an integer")
      .min(1, "limit must be at least 1")
      .max(100, "limit must be at most 100")
      .default(20),
  })
  .refine(
    (data) => {
      if (data.minChapters !== undefined && data.maxChapters !== undefined) {
        return data.minChapters <= data.maxChapters;
      }
      return true;
    },
    { message: "minChapters must be ≤ maxChapters", path: ["minChapters"] }
  )
  .refine(
    (data) => {
      if (data.minEpisodes !== undefined && data.maxEpisodes !== undefined) {
        return data.minEpisodes <= data.maxEpisodes;
      }
      return true;
    },
    { message: "minEpisodes must be ≤ maxEpisodes", path: ["minEpisodes"] }
  );

export type AdvancedSearchQueryInput = z.infer<typeof advancedSearchQuerySchema>;


