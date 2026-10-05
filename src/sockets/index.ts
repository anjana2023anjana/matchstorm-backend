import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { RoomManager } from '../domain/RoomManager.js';
import { registerMatchmakingHandlers } from './matchmaking.handler.js';
import { registerGameplayHandlers } from './gameplay.handler.js';

export function initializeSockets(io: Server) {
  const roomManager = RoomManager.getInstance();

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    registerMatchmakingHandlers(io, socket);
    registerGameplayHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      roomManager.removeFromQueue(socket.id);
    });
  });
}