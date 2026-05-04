/**
 * Structured application error — carries HTTP status and error code
 * so the global handler can serialize it consistently.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details; // validation errors, field hints, etc.
    this.isOperational = true; // signals this is a known/expected error
    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience factory methods
  static badRequest(msg, code = "BAD_REQUEST", details = null) {
    return new AppError(msg, 400, code, details);
  }

  static unauthorized(msg = "Authentication required") {
    return new AppError(msg, 401, "UNAUTHORIZED");
  }

  static forbidden(msg = "Access denied") {
    return new AppError(msg, 403, "FORBIDDEN");
  }

  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404, "NOT_FOUND");
  }

  static conflict(msg, code = "CONFLICT") {
    return new AppError(msg, 409, code);
  }

  static tooManyRequests(msg = "Too many requests") {
    return new AppError(msg, 429, "RATE_LIMITED");
  }

  static internal(msg = "Internal server error") {
    return new AppError(msg, 500, "INTERNAL_ERROR");
  }
}

/**
 * Wraps an async route handler to automatically forward errors to next().
 * Eliminates repetitive try/catch in every controller.
 *
 * Usage:
 *   router.get("/path", asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, asyncHandler };