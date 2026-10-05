import { Router, Response } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateJwt, AuthenticatedRequest } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new UserController();

router.get('/me', authenticateJwt, (req, res) => controller.getMe(req as AuthenticatedRequest, res as Response));

export default router;