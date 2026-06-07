import { Router } from "express";
import { validateQuery } from "../../middlewares/validateQuery.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { searchQuerySchema, chaptersQuerySchema } from "./manga.schema";
import { searchManga, getMangaDetails, getMangaChapters } from "./manga.controller";

export const mangaRouter = Router();

// ─── Public routes ───────────────────────────────────────────

// Search manga by title
// GET /api/v1/manga?q=chainsaw&limit=10&offset=0
mangaRouter.get("/", validateQuery(searchQuerySchema), searchManga);

// ─── Protected routes ────────────────────────────────────────
// Manga detail and chapter routes require authentication so the
// response can include user-specific tracking data.

// Get manga details by MangaDex UUID (includes user tracking status)
// GET /api/v1/manga/:id
mangaRouter.get("/:id", authMiddleware, getMangaDetails);

// Get chapter feed for a manga
// GET /api/v1/manga/:id/chapters?limit=100&offset=0&language=en
mangaRouter.get("/:id/chapters", authMiddleware, validateQuery(chaptersQuerySchema), getMangaChapters);
