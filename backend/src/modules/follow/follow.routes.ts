import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { validateParams } from "../../middlewares/validateParams.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { followInputSchema, progressInputSchema, followMangaIdParamSchema } from "./follow.schema";
import { followManga, unfollowManga, updateProgress } from "./follow.controller";

export const followRouter = Router();

// ─── All follow routes require authentication ────────────────

// Follow a manga
// POST /api/v1/follows  { mangaId: "<MangaDex UUID>" }
followRouter.post(
  "/",
  authMiddleware,
  validate(followInputSchema),
  followManga
);

// Unfollow a manga
// DELETE /api/v1/follows/:mangaId
followRouter.delete(
  "/:mangaId",
  authMiddleware,
  validateParams(followMangaIdParamSchema),
  unfollowManga
);

// Update reading progress for a followed manga
// PATCH /api/v1/follows/:mangaId/progress  { lastReadChapter: "12" }
followRouter.patch(
  "/:mangaId/progress",
  authMiddleware,
  validateParams(followMangaIdParamSchema),
  validate(progressInputSchema),
  updateProgress
);
