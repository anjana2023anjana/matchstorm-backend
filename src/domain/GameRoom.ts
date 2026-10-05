import { Player } from './Player.js';

export class GameRoom {
  public isFinished = false;
  public winnerId: string | null = null;
  public readonly createdAt = Date.now();

  constructor(
    public readonly roomId: string,
    public readonly player1: Player,
    public readonly player2: Player
  ) {}

  public getOpponent(socketId: string): Player {
    return this.player1.socketId === socketId ? this.player2 : this.player1;
  }

  public getPlayer(socketId: string): Player {
    return this.player1.socketId === socketId ? this.player1 : this.player2;
  }
}