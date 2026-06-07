import { Router } from "express";
import { validateQuery } from "../../middlewares/validateQuery.middleware";
import { searchQuerySchema, chaptersQuerySchema } from "./manga.schema";
import { searchManga, getMangaDetails, getMangaChapters } from "./manga.controller";

export const mangaRouter = Router();

// ─── Public routes ───────────────────────────────────────────
// All manga endpoints are public — authentication is not required
// to search or browse manga. Follow/track endpoints will be
// added in a separate module and will require auth.

// Search manga by title
// GET /api/v1/manga?q=chainsaw&limit=10&offset=0
mangaRouter.get("/", validateQuery(searchQuerySchema), searchManga);

// Get manga details by MangaDex UUID
// GET /api/v1/manga/:id
mangaRouter.get("/:id", getMangaDetails);

// Get chapter feed for a manga
// GET /api/v1/manga/:id/chapters?limit=100&offset=0&language=en
mangaRouter.get("/:id/chapters", validateQuery(chaptersQuerySchema), getMangaChapters);
