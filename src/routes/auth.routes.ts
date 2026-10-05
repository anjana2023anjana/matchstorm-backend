import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';

const router = Router();
const controller = new AuthController();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/register', validateBody(registerSchema), (req: Request, res: Response) => controller.register(req, res));
router.post('/login', validateBody(loginSchema), (req: Request, res: Response) => controller.login(req, res));

export default router;