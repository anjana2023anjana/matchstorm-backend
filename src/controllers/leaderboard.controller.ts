import { Request, Response } from 'express';
import { LeaderboardService } from '../services/leaderboard.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  async getTopPlayers(_req: Request, res: Response) {
    try {
      const rankings = await leaderboardService.getTopRankings(20);
      return sendSuccess(res, rankings);
    } catch {
      return sendError(res, 'Failed to fetch leaderboard', 500);
    }
  }
}