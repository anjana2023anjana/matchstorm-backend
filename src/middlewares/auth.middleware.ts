import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; username: string };
}

export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Missing or invalid token', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; username: string };
    req.user = decoded;
    next();
  } catch {
    return sendError(res, 'Unauthorized or expired session', 401);
  }
}