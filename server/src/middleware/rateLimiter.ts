import { Request, Response, NextFunction } from 'express';

const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

export function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ipHeader = req.headers['x-forwarded-for'];
    const ip = req.ip || (Array.isArray(ipHeader) ? ipHeader[0] : ipHeader) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // If key doesn't exist or rate-limit window has expired, reset
    if (!rateLimitStore[ip] || rateLimitStore[ip].resetTime < now) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    rateLimitStore[ip].count += 1;

    if (rateLimitStore[ip].count > limit) {
      return res.status(429).json({
        error: 'Too many requests from this IP, please try again later.'
      });
    }

    next();
  };
}
