import { Server, Socket } from 'socket.io';
import { RoomManager } from '../domain/RoomManager.js';
import { SwapAction } from '../interfaces/engine.interface.js';
import { validateAndSimulateSwap } from '../engine/swapValidator.js';
import { executeFullCascade } from '../engine/cascadeEngine.js';
import { MatchHistoryService } from '../services/matchHistory.service.js';

const matchHistoryService = new MatchHistoryService();

export function registerGameplayHandlers(io: Server, socket: Socket) {
  const roomManager = RoomManager.getInstance();

  socket.on('game:request_swap', async (swap: SwapAction) => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room || room.isFinished) return;

    const player = room.getPlayer(socket.id);
    const opponent = room.getOpponent(socket.id);

    const validation = validateAndSimulateSwap(player.board, swap);
    if (!validation.isValid || !validation.newBoard) {
      socket.emit('game:swap_rejected', { swap });
      return;
    }

    const { finalBoard, steps, totalDamage, totalShield } = executeFullCascade(validation.newBoard);
    player.board = finalBoard;
    player.shield += totalShield;
    opponent.applyDamage(totalDamage);

    socket.emit('game:cascade_resolved', {
      steps,
      finalBoard,
      damageDealt: totalDamage,
      playerHP: player.hp,
      playerShield: player.shield,
      opponentHP: opponent.hp
    });

    io.to(opponent.socketId).emit('game:opponent_attacked', {
      damageTaken: totalDamage,
      opponentBoard: finalBoard,
      opponentHP: player.hp,
      opponentShield: player.shield,
      myHP: opponent.hp
    });

    if (opponent.hp <= 0) {
      room.isFinished = true;
      room.winnerId = player.userId;

      io.to(room.roomId).emit('game:over', { winnerId: player.userId, reason: 'KO' });

      const durationSec = Math.floor((Date.now() - room.createdAt) / 1000);
      await matchHistoryService.finalizeMatch(player.userId, opponent.userId, player.userId, durationSec);

      roomManager.cleanupRoom(room.roomId);
    }
  });

  socket.on('game:forfeit', async () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room || room.isFinished) return;

    const winner = room.getOpponent(socket.id);
    const loser = room.getPlayer(socket.id);

    room.isFinished = true;
    io.to(room.roomId).emit('game:over', { winnerId: winner.userId, reason: 'SURRENDER' });

    const durationSec = Math.floor((Date.now() - room.createdAt) / 1000);
    await matchHistoryService.finalizeMatch(loser.userId, winner.userId, winner.userId, durationSec);

    roomManager.cleanupRoom(room.roomId);
  });
}