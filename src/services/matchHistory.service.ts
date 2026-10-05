import { MatchRepository } from '../repositories/match.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export class MatchHistoryService {
  private matchRepo = new MatchRepository();
  private userRepo = new UserRepository();

  async finalizeMatch(p1Id: string, p2Id: string, winnerId: string, durationSec: number) {
    await this.matchRepo.recordMatch(p1Id, p2Id, winnerId, durationSec);

    const isP1Winner = p1Id === winnerId;
    await this.userRepo.updateStats(p1Id, isP1Winner, isP1Winner ? 25 : -15);
    await this.userRepo.updateStats(p2Id, !isP1Winner, !isP1Winner ? 25 : -15);
  }
}