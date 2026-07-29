import Redis from "ioredis";
import { env } from "../config/env.js";
import { RedisMock } from "./redisMock.js";

export const redis = env.BYPASS_REDIS === "true"
  ? new RedisMock()
  : new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

if (env.BYPASS_REDIS !== "true") {
  redis.on("error", (err) => {
    console.error("Redis connection error:", err);
  });
}
