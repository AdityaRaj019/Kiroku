import type { Request, Response, NextFunction } from "express";

/**
 * Application-level error class with HTTP status codes.
 * Throw these from controllers; the error middleware will format them.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Global catch-all error middleware.
 *
 * Design choices:
 * - In production, generic messages are returned to avoid leaking internals.
 * - In development, the full error message is returned for debugging.
 * - Stack traces are logged server-side but never sent to the client.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const httpErr = err as Error & { status?: number; statusCode?: number; type?: string };
  const errStatus = (err instanceof AppError) ? err.statusCode : (httpErr.status ?? httpErr.statusCode ?? 500);
  const isClientError = errStatus >= 400 && errStatus < 500;

  // Log server-side for observability
  if (isClientError) {
    console.warn(`[ClientWarning] ${err.name} (${errStatus}): ${err.message}`);
  } else {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
    if (process.env.NODE_ENV !== "production") {
      console.error(err.stack);
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Handle Express/body-parser errors that carry a status code
  // (e.g., PayloadTooLargeError → 413, SyntaxError from bad JSON → 400)
  if (errStatus && errStatus >= 400 && errStatus < 600) {
    const safeMessage =
      process.env.NODE_ENV === "production"
        ? "Request error"
        : err.message;
    res.status(errStatus).json({ error: safeMessage });
    return;
  }

  // Unknown errors — never leak internals in production
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({ error: message });
}
