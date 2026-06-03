import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { register, login, refresh, logout, profile } from "./auth.controller";

export const authRouter = Router();

// ─── Public routes ───────────────────────────────────────────

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", refresh); // reads from cookie, no body needed

// ─── Protected routes ────────────────────────────────────────

authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/profile", authMiddleware, profile);
