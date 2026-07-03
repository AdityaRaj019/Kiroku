import { Router } from "express";
import { validateQuery } from "../../middlewares/validateQuery.middleware";
import { validateParams } from "../../middlewares/validateParams.middleware";
import { optionalAuthMiddleware } from "../../middlewares/auth.middleware";
import {
  searchQuerySchema,
  advancedSearchQuerySchema,
  chaptersQuerySchema,
  mangaIdParamSchema,
  showcaseQuerySchema,
} from "./manga.schema";
import {
  searchManga,
  advancedSearchManga,
  getMangaDetails,
  getMangaChapters,
  getMangaShowcase,
} from "./manga.controller";

export const mangaRouter = Router();

// ─── Public routes ───────────────────────────────────────────

// Get explore page showcase lists (no auth required)
// GET /api/v1/manga/showcase?trendingPeriod=day
mangaRouter.get("/showcase", validateQuery(showcaseQuerySchema), getMangaShowcase);

// Search manga by title (no auth required)
// GET /api/v1/manga?q=chainsaw&limit=10&offset=0
mangaRouter.get("/", validateQuery(searchQuerySchema), searchManga);

// Advanced multi-attribute search against the local database
// Supports genre, format, country, year, chapter/episode ranges, and platform filters.
// All params are optional and AND-combined. Frontend should debounce (300-500ms).
// GET /api/v1/manga/search?genres=Action,Fantasy&format=MANGA&minChapters=50
mangaRouter.get("/search", validateQuery(advancedSearchQuerySchema), advancedSearchManga);

// Get manga details by MangaDex UUID
// Publicly accessible; optional auth enriches response with user tracking data.
// Guests see manga info only; logged-in users also see follow/read status.
// GET /api/v1/manga/:id
mangaRouter.get(
  "/:id",
  validateParams(mangaIdParamSchema),
  optionalAuthMiddleware,
  getMangaDetails
);

// Get chapter feed for a manga (no auth required)
// GET /api/v1/manga/:id/chapters?limit=100&offset=0&language=en
mangaRouter.get(
  "/:id/chapters",
  validateParams(mangaIdParamSchema),
  validateQuery(chaptersQuerySchema),
  getMangaChapters
);
