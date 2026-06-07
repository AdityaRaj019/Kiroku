import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Returns an Express middleware that validates `req.params` against the
 * provided Zod schema.
 *
 * This is the params counterpart of `validateQuery`. It eliminates
 * hand-written regex validation scattered across controllers (e.g.
 * UUID format checks for `:id` params).
 *
 * On validation failure, responds with 400 and a structured error array
 * so the client can display field-level messages.
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({ error: "Validation failed", details: errors });
        return;
      }

      next(err);
    }
  };
}
