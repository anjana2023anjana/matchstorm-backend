import { prisma } from '../config/database.js';

export class MatchRepository {
  async recordMatch(p1Id: string, p2Id: string, winnerId: string, duration: number) {
    return prisma.matchHistory.create({
      data: {
        player1Id: p1Id,
        player2Id: p2Id,
        winnerId,
        duration
      }
    });
  }

  async getMatchesByUserId(userId: string, limit = 10) {
    return prisma.matchHistory.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }]
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
}