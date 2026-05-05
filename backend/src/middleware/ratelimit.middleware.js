const redis = require("../lib/redis");
const { AppError } = require("../lib/errors");
const logger = require("../lib/logger");

/**
 * Redis-backed sliding-window rate limiter.
 * Falls back to in-memory if Redis is unavailable.
 *
 * @param {object} options
 *   - windowMs    Window size in ms          (default: 15 min)
 *   - max         Max requests per window    (default: 100)
 *   - keyFn       Function to derive key     (default: IP)
 *   - message     Error message
 *   - skipSuccess Only count failed requests (default: false)
 */

// In-memory fallback store
const memStore = new Map();

const redisRateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyFn = (req) => `rl:${req.ip}`,
  message = "Too many requests, please try again later.",
  skipSuccess = false,
} = {}) => {
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req, res, next) => {
    const key = keyFn(req);

    // Try Redis first
    try {
      const count = await redis.incr(key, windowSeconds);
      if (count !== null) {
        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count));

        if (count > max) {
          logger.warn(`Rate limit exceeded: key=${key} count=${count}`);
          return next(AppError.tooManyRequests(message));
        }
        return next();
      }
    } catch (err) {
      logger.warn(`Redis rate limit error, falling back to memory: ${err.message}`);
    }

    // In-memory fallback
    const now = Date.now();
    const record = memStore.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count++;
    memStore.set(key, record);

    // Cleanup old entries periodically
    if (memStore.size > 5000) {
      for (const [k, v] of memStore) {
        if (Date.now() > v.resetAt) memStore.delete(k);
      }
    }

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));

    if (record.count > max) {
      return next(AppError.tooManyRequests(message));
    }

    next();
  };
};

// Pre-configured limiters
const authLimiter = redisRateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  keyFn: (req) => `rl:auth:${req.ip}`,
  message: "Too many auth attempts. Try again in 15 minutes.",
});

const apiLimiter = redisRateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 120,
  keyFn: (req) => `rl:api:${req.user?._id || req.ip}`,
  message: "Too many requests. Slow down!",
});

const messageLimiter = redisRateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 10,
  keyFn: (req) => `rl:msg:${req.user?._id || req.ip}`,
  message: "You're sending messages too fast.",
});

const uploadLimiter = redisRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  keyFn: (req) => `rl:upload:${req.user?._id || req.ip}`,
  message: "Upload limit reached. Try again in 1 hour.",
});

module.exports = { redisRateLimit, authLimiter, apiLimiter, messageLimiter, uploadLimiter };