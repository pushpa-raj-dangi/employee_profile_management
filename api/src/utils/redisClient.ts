import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: +(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  
   retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
    return targetErrors.some(msg => err.message.includes(msg));
  },
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

export default redisClient;



