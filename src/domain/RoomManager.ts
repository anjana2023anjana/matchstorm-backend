import { GameRoom } from './GameRoom.js';
import { Player } from './Player.js';
import { generateInitialBoard } from '../engine/boardGenerator.js';

export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, GameRoom> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private waitingQueue: { socketId: string; userId: string; username: string }[] = [];

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) RoomManager.instance = new RoomManager();
    return RoomManager.instance;
  }

  public enqueuePlayer(socketId: string, userId: string, username: string): GameRoom | null {
    if (this.waitingQueue.some((p) => p.socketId === socketId)) return null;

    if (this.waitingQueue.length > 0) {
      const opponent = this.waitingQueue.shift()!;
      const roomId = `room_${Date.now()}`;

      const p1 = new Player(opponent.socketId, opponent.userId, opponent.username, generateInitialBoard());
      const p2 = new Player(socketId, userId, username, generateInitialBoard());

      const room = new GameRoom(roomId, p1, p2);
      this.rooms.set(roomId, room);
      this.socketToRoom.set(p1.socketId, roomId);
      this.socketToRoom.set(p2.socketId, roomId);
      return room;
    }

    this.waitingQueue.push({ socketId, userId, username });
    return null;
  }

  public getRoomBySocket(socketId: string): GameRoom | undefined {
    const roomId = this.socketToRoom.get(socketId);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  public cleanupRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.socketToRoom.delete(room.player1.socketId);
      this.socketToRoom.delete(room.player2.socketId);
      this.rooms.delete(roomId);
    }
  }

  public removeFromQueue(socketId: string): void {
    this.waitingQueue = this.waitingQueue.filter((p) => p.socketId !== socketId);
  }
}