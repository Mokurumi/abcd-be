import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  skipSuccessfulRequests: true,
});

const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

const commonLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

export { authLimiter, uploadLimiter, commonLimiter };
