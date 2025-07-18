import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: +(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,

  tls: process.env.REDIS_TLS === "true" ? {} : undefined,

  retryStrategy: (times) => {
    if (times > 30) { 
      return null;
    }
    const delay = Math.min(times * 100, 2000); 
    return delay;
  },

  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'];
    if (err && err.message) {
      return targetErrors.some(msg => err.message.includes(msg));
    }
    return false;
  },

  keepAlive: 30000, // milliseconds
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

redisClient.on("close", () => {
  console.warn("Redis connection closed");
});

redisClient.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay} ms`);
});

export default redisClient;
