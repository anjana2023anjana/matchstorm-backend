import { UserRepository } from '../repositories/user.repository.js';

export class LeaderboardService {
  private userRepo = new UserRepository();

  async getTopRankings(limit = 20) {
    return this.userRepo.getLeaderboard(limit);
  }
}