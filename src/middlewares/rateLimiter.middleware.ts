import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

const requests = new Map<string, { count: number; firstRequestTime: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();

  const record = requests.get(ip);
  if (!record || now - record.firstRequestTime > WINDOW_MS) {
    requests.set(ip, { count: 1, firstRequestTime: now });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return sendError(res, 'Too many requests, try again later', 429);
  }

  record.count++;
  next();
}