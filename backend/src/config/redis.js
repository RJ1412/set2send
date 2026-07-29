import Redis from "ioredis";
import { env } from "./env.js";
import { RedisMock } from "../utils/redisMock.js";

export const createRedisConnection = () => {
  if (env.BYPASS_REDIS === "true") {
    return new RedisMock();
  }
  const connection = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });
  
  connection.on("error", (err) => {
    console.error("[Redis Error]", err.message);
  });
  
  return connection;
};

// Singleton connection for Queues (shared)
export const sharedQueueConnection = createRedisConnection();
