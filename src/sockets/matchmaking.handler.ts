import { Server, Socket } from 'socket.io';
import { RoomManager } from '../domain/RoomManager.js';
import { logger } from '../utils/logger.js';

export function registerMatchmakingHandlers(io: Server, socket: Socket) {
  const roomManager = RoomManager.getInstance();

  socket.on('match:join_queue', (payload: { userId: string; username: string }) => {
    const room = roomManager.enqueuePlayer(socket.id, payload.userId, payload.username);

    if (room) {
      socket.join(room.roomId);
      io.sockets.sockets.get(room.player1.socketId)?.join(room.roomId);

      io.to(room.player1.socketId).emit('match:started', {
        roomId: room.roomId,
        yourBoard: room.player1.board,
        opponentName: room.player2.username
      });

      io.to(room.player2.socketId).emit('match:started', {
        roomId: room.roomId,
        yourBoard: room.player2.board,
        opponentName: room.player1.username
      });

      logger.info(`Match created: ${room.roomId} between ${room.player1.username} & ${room.player2.username}`);
    } else {
      socket.emit('match:queued');
    }
  });

  socket.on('match:leave_queue', () => {
    roomManager.removeFromQueue(socket.id);
  });
}