import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err, stack: err.stack }, err.message);
  return sendError(res, err.message || 'Internal Server Error', 500);
}