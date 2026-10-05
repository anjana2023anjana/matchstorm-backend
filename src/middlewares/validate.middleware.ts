import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function validateBody(schema: ZodType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError(res, 'Validation error', 400, error.issues);
      }
      return sendError(res, 'Malformed payload', 400);
    }
  };
}