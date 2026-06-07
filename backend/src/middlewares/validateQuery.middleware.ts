import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Returns an Express middleware that validates `req.query` against the
 * provided Zod schema.
 *
 * Unlike the body `validate()` middleware, this targets query parameters
 * which arrive as strings. Schemas should use `.coerce` or `.transform`
 * for numeric/boolean coercion.
 *
 * On validation failure, responds with 400 and a structured error array
 * so the client can display field-level messages.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
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
