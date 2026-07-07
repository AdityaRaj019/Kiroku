import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { updateProfileSchema } from "./user.schema";
import { getUserProfile, updateUserProfile } from "./user.controller";

export const userRouter = Router();

// GET /api/v1/users/:id - Get user profile (public or self)
userRouter.get(
  "/:id",
  authMiddleware,
  getUserProfile
);

// PUT /api/v1/users/profile - Update own user profile
userRouter.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateUserProfile
);
