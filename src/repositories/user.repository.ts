import { prisma } from '../config/database.js';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        eloRating: true,
        matchesWon: true,
        matchesLost: true
      }
    });
  }

  async createUser(data: { email: string; username: string; passwordHash: string }) {
    return prisma.user.create({ data });
  }

  async updateStats(userId: string, isWinner: boolean, ratingDelta: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        eloRating: { increment: ratingDelta },
        matchesWon: isWinner ? { increment: 1 } : undefined,
        matchesLost: !isWinner ? { increment: 1 } : undefined
      }
    });
  }

  async getLeaderboard(limit = 20) {
    return prisma.user.findMany({
      take: limit,
      orderBy: { eloRating: 'desc' },
      select: { id: true, username: true, eloRating: true, matchesWon: true, matchesLost: true }
    });
  }
}