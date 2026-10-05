import { Response } from 'express';
import { UserService } from '../services/user.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

const userService = new UserService();

export class UserController {
  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) return sendError(res, 'Unauthorized', 401);
      const profile = await userService.getUserProfile(req.user.id);
      return sendSuccess(res, profile);
    } catch {
      return sendError(res, 'Could not retrieve profile', 500);
    }
  }
}