import { BoardGrid, MatchGroup, Tile } from '../interfaces/engine.interface.js';
import { GRID_SIZE } from '../config/game.constants.js';

export function detectMatches(board: BoardGrid): MatchGroup[] {
  const matchGroups: MatchGroup[] = [];

  // Horizontal scan
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 2; c++) {
      const startTile = board[r][c];
      if (!startTile) continue;

      let len = 1;
      while (c + len < GRID_SIZE && board[r][c + len]?.type === startTile.type) {
        len++;
      }

      if (len >= 3) {
        const tiles: Tile[] = [];
        for (let i = 0; i < len; i++) {
          tiles.push(board[r][c + i]!);
        }
        matchGroups.push({ type: startTile.type, tiles });
        c += len - 1;
      }
    }
  }

  // Vertical scan
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r < GRID_SIZE - 2; r++) {
      const startTile = board[r][c];
      if (!startTile) continue;

      let len = 1;
      while (r + len < GRID_SIZE && board[r + len][c]?.type === startTile.type) {
        len++;
      }

      if (len >= 3) {
        const tiles: Tile[] = [];
        for (let i = 0; i < len; i++) {
          tiles.push(board[r + i][c]!);
        }
        matchGroups.push({ type: startTile.type, tiles });
        r += len - 1;
      }
    }
  }

  return matchGroups;
}