const { createClient } = require("redis");
const logger = require("./logger");

let client = null;
let isConnected = false;

const createRedisClient = () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379",
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          logger.error("Redis: max reconnection attempts reached");
          return new Error("Max reconnect attempts reached");
        }
        const delay = Math.min(retries * 100, 3000);
        logger.warn(`Redis: reconnecting in ${delay}ms (attempt ${retries})`);
        return delay;
      },
      connectTimeout: 10000,
    },
    // Connection pool
    isolationPoolOptions: {
      min: 2,
      max: 10,
    },
  });

  redisClient.on("connect", () => {
    isConnected = true;
    logger.info("✅ Redis connected");
  });

  redisClient.on("error", (err) => {
    isConnected = false;
    logger.error(`Redis error: ${err.message}`);
  });

  redisClient.on("reconnecting", () => {
    logger.warn("Redis: attempting to reconnect...");
  });

  redisClient.on("end", () => {
    isConnected = false;
    logger.warn("Redis: connection closed");
  });

  return redisClient;
};

const connectRedis = async () => {
  client = createRedisClient();
  try {
    await client.connect();
  } catch (err) {
    logger.error(`Redis initial connection failed: ${err.message}`);
    // Don't crash — app works without cache, just slower
  }
};

// Safe get — returns null on any error
const get = async (key) => {
  if (!client || !isConnected) return null;
  try {
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    logger.warn(`Redis GET failed for key "${key}": ${err.message}`);
    return null;
  }
};

// Safe set with TTL
const set = async (key, value, ttlSeconds = 300) => {
  if (!client || !isConnected) return false;
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (err) {
    logger.warn(`Redis SET failed for key "${key}": ${err.message}`);
    return false;
  }
};

// Delete one or more keys (supports glob patterns via scan)
const del = async (...keys) => {
  if (!client || !isConnected) return false;
  try {
    await client.del(keys);
    return true;
  } catch (err) {
    logger.warn(`Redis DEL failed: ${err.message}`);
    return false;
  }
};

// Delete all keys matching a pattern (e.g. "channels:*")
const delPattern = async (pattern) => {
  if (!client || !isConnected) return false;
  try {
    let cursor = 0;
    do {
      const { cursor: next, keys } = await client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = next;
      if (keys.length > 0) {
        await client.del(keys);
      }
    } while (cursor !== 0);
    return true;
  } catch (err) {
    logger.warn(`Redis DELPATTERN failed for "${pattern}": ${err.message}`);
    return false;
  }
};

// Increment a counter (for rate limiting, analytics)
const incr = async (key, ttlSeconds = 60) => {
  if (!client || !isConnected) return null;
  try {
    const val = await client.incr(key);
    if (val === 1) await client.expire(key, ttlSeconds);
    return val;
  } catch (err) {
    logger.warn(`Redis INCR failed for "${key}": ${err.message}`);
    return null;
  }
};

// Pub/Sub for cross-instance socket events
const getPublisher = () => {
  if (!client) throw new Error("Redis not initialized");
  return client.duplicate();
};

const getSubscriber = () => {
  if (!client) throw new Error("Redis not initialized");
  return client.duplicate();
};

const isHealthy = () => isConnected;

const disconnect = async () => {
  if (client) {
    await client.quit();
    client = null;
    isConnected = false;
  }
};

module.exports = {
  connectRedis,
  get,
  set,
  del,
  delPattern,
  incr,
  getPublisher,
  getSubscriber,
  isHealthy,
  disconnect,
};