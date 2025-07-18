import rateLimit from "express-rate-limit";

export const graphqlRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: 'Too many requests from this IP, please try again later',
  keyGenerator: (req, res) => {
    const rawIp = req.ip || '';
    const cleanIp = rawIp.split(':').slice(0, -1).join(':');
    return cleanIp;
  },
})