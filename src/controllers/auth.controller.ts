import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;
      const data = await authService.register(email, username, password);
      return sendSuccess(res, data, 'User registered successfully', 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return sendError(res, msg, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return sendSuccess(res, data, 'Login successful');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return sendError(res, msg, 401);
    }
  }
}