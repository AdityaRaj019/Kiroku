import { createClient, type RedisClientType } from "redis";

/**
 * Singleton Redis client shared across the entire backend.
 *
 * Uses the `redis` v4 library (node-redis) configured via REDIS_URL.
 * The globalThis cache prevents duplicate connections during
 * nodemon hot-reloads in development.
 *
 * The client reconnects automatically with exponential backoff
 * (capped at 5 seconds) so transient Redis outages don't crash
 * the process.
 */

function createRedisClient(): RedisClientType {
  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error("REDIS_URL must be set in the environment.");
  }

  const client: RedisClientType = createClient({
    url,
    socket: {
      reconnectStrategy(retries: number): number | Error {
        if (retries > 20) {
          return new Error(
            `Redis: exceeded 20 reconnect attempts. Last retry #${retries}.`
          );
        }
        // Exponential backoff: 2^retries * 50ms, capped at 5 000ms
        return Math.min(2 ** retries * 50, 5_000);
      },
    },
  });

  client.on("error", (err: Error) => {
    console.error("[Redis] Client error:", err.message);
  });

  client.on("connect", () => {
    console.log("[Redis] Connected successfully.");
  });

  client.on("reconnecting", () => {
    console.warn("[Redis] Reconnecting…");
  });

  return client;
}

const globalForRedis = globalThis as unknown as {
  redisClient: RedisClientType | undefined;
};

/**
 * The shared Redis client instance.
 *
 * **Important:** `redis` v4 clients are lazy — you must call
 * `connectRedis()` once at server startup before issuing commands.
 */
export const redisClient: RedisClientType =
  globalForRedis.redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}

/**
 * Connects the singleton Redis client.
 * Call this once during server bootstrap (e.g. in `index.ts`).
 * Subsequent calls are safe — `redis` v4 ignores connect()
 * if the client is already open.
 */
export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

/**
 * Gracefully disconnects the Redis client.
 * Call during server shutdown to flush pending commands.
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}
