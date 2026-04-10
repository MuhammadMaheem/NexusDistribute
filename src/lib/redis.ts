import { Redis } from "@upstash/redis";

const globalForRedis = globalThis as unknown as { redis: Redis | null };

export const redis =
  globalForRedis.redis ||
  (process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null);

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
