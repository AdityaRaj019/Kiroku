import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Returns an Express middleware that validates `req.body` against the
 * provided Zod schema.
 *
 * On validation failure, responds with 400 and a structured error array
 * so the client can display field-level messages.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
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
