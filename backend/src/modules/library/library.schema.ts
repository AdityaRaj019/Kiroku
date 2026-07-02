import { z } from "zod";

// ─── Enums (mirroring Prisma enums for Zod validation) ───────

const MediaType = z.enum(["MANGA", "ANIME"]);
const LibraryStatus = z.enum(["READING", "COMPLETED", "PLAN_TO_READ", "DROPPED", "PAUSED"]);

// ─── Upsert Library Item (POST /api/v1/library) ─────────────

/**
 * Validates the request body for adding or updating a library item.
 *
 * Rules:
 * - Exactly one of `mangaId` or `animeId` must be provided.
 * - `mangaId` is a MangaDex UUID used to resolve or upsert local Manga records.
 * - `animeId` is an external source identifier for anime (e.g. AniList ID).
 * - `rating` is optional, clamped to 1–10.
 * - `progress` must be non-negative.
 * - `startDate` must precede `endDate` when both are provided.
 */
export const upsertLibraryItemSchema = z
  .object({
    mangaId: z
      .string()
      .uuid("mangaId must be a valid UUID")
      .optional(),
    animeId: z
      .string()
      .min(1, "animeId must not be empty")
      .max(255, "animeId must be 255 characters or fewer")
      .optional(),
    mediaType: MediaType.default("MANGA"),
    status: LibraryStatus.default("READING"),
    progress: z
      .number({ invalid_type_error: "progress must be a number" })
      .int("progress must be an integer")
      .min(0, "progress cannot be negative")
      .default(0),
    favorite: z
      .boolean({ invalid_type_error: "favorite must be a boolean" })
      .default(false),
    enableNotifications: z
      .boolean({ invalid_type_error: "enableNotifications must be a boolean" })
      .default(true),
    rating: z
      .number({ invalid_type_error: "rating must be a number" })
      .int("rating must be an integer")
      .min(1, "rating must be at least 1")
      .max(10, "rating must be at most 10")
      .nullable()
      .optional(),
    startDate: z
      .string()
      .datetime({ message: "startDate must be a valid ISO 8601 datetime" })
      .nullable()
      .optional()
      .transform((v) => (v === undefined ? undefined : v ? new Date(v) : null)),
    endDate: z
      .string()
      .datetime({ message: "endDate must be a valid ISO 8601 datetime" })
      .nullable()
      .optional()
      .transform((v) => (v === undefined ? undefined : v ? new Date(v) : null)),
    reReadCount: z
      .number({ invalid_type_error: "reReadCount must be a number" })
      .int("reReadCount must be an integer")
      .min(0, "reReadCount cannot be negative")
      .default(0),
  })
  .strict()
  .refine(
    (data) => data.mangaId || data.animeId,
    { message: "Either mangaId or animeId must be provided", path: ["mangaId"] }
  )
  .refine(
    (data) => !(data.mangaId && data.animeId),
    { message: "Provide only one of mangaId or animeId, not both", path: ["mangaId"] }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["endDate"] }
  );

export type UpsertLibraryItemInput = z.infer<typeof upsertLibraryItemSchema>;

// ─── Library Query (GET /api/v1/library) ─────────────────────

/**
 * Validates query parameters for listing library items.
 *
 * All parameters are optional. Defaults:
 * - page: 1
 * - limit: 20 (max 100)
 * - sort: "updated"
 * - order: "desc"
 */

const SortField = z.enum(["updated", "created", "rating", "title"]);
const SortOrder = z.enum(["asc", "desc"]);

export const libraryQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((v) => parseInt(v, 10))
      .pipe(z.number().int().min(1, "page must be at least 1")),
    limit: z
      .string()
      .optional()
      .default("20")
      .transform((v) => parseInt(v, 10))
      .pipe(z.number().int().min(1, "limit must be at least 1").max(100, "limit must be at most 100")),
    status: z
      .string()
      .optional()
      .transform((v) => (v ? v.toUpperCase() : undefined))
      .pipe(LibraryStatus.optional()),
    mediaType: z
      .string()
      .optional()
      .transform((v) => (v ? v.toUpperCase() : undefined))
      .pipe(MediaType.optional()),
    favorite: z
      .string()
      .optional()
      .transform((v) => {
        if (v === "true") return true;
        if (v === "false") return false;
        return undefined;
      })
      .pipe(z.boolean().optional()),
    sort: z
      .string()
      .optional()
      .default("updated")
      .transform((v) => v.toLowerCase())
      .pipe(SortField),
    order: z
      .string()
      .optional()
      .default("desc")
      .transform((v) => v.toLowerCase())
      .pipe(SortOrder),
  })
  .strict();

export type LibraryQueryInput = z.infer<typeof libraryQuerySchema>;

// ─── Library Item ID Param (route :itemId) ───────────────────

/**
 * Validates the `:itemId` route parameter.
 * Library items use integer primary keys.
 */
export const libraryItemIdParamSchema = z.object({
  itemId: z
    .string()
    .regex(/^\d+$/, "itemId must be a numeric ID")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive("itemId must be a positive integer")),
});

export type LibraryItemIdParam = z.infer<typeof libraryItemIdParamSchema>;

// ─── Public User Library Param (route :userId) ───────────────

/**
 * Validates the `:userId` route parameter for public profile views.
 */
export const libraryUserIdParamSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "userId must be a numeric ID")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive("userId must be a positive integer")),
});

export type LibraryUserIdParam = z.infer<typeof libraryUserIdParamSchema>;
