import { Router, Request, Response } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller.js';

const router = Router();
const controller = new LeaderboardController();

router.get('/top', (req: Request, res: Response) => controller.getTopPlayers(req, res));

export default router;