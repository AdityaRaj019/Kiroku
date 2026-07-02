import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { validateQuery } from "../../middlewares/validateQuery.middleware";
import { validateParams } from "../../middlewares/validateParams.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  upsertLibraryItemSchema,
  libraryQuerySchema,
  libraryItemIdParamSchema,
  libraryUserIdParamSchema,
} from "./library.schema";
import { upsertLibraryItem } from "./controllers/upsert";
import { getUserLibrary, getPublicUserLibrary } from "./controllers/list";
import { removeLibraryItem } from "./controllers/delete";

export const libraryRouter = Router();

// ─── Endpoints ────────────────────────────────────────────────

// Upsert a library item (Create or Update)
// POST /api/v1/library
libraryRouter.post(
  "/",
  authMiddleware,
  validate(upsertLibraryItemSchema),
  upsertLibraryItem
);

// Get authenticated user's library (Private)
// GET /api/v1/library
libraryRouter.get(
  "/",
  authMiddleware,
  validateQuery(libraryQuerySchema),
  getUserLibrary
);

// Get another user's library (Public Profile view)
// GET /api/v1/library/users/:userId
libraryRouter.get(
  "/users/:userId",
  validateParams(libraryUserIdParamSchema),
  validateQuery(libraryQuerySchema),
  getPublicUserLibrary
);

// Remove an item from the library
// DELETE /api/v1/library/:itemId
libraryRouter.delete(
  "/:itemId",
  authMiddleware,
  validateParams(libraryItemIdParamSchema),
  removeLibraryItem
);
