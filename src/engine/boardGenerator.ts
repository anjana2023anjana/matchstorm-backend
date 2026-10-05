import { BoardGrid, ElementType } from '../interfaces/engine.interface.js';
import { ELEMENT_TYPES, GRID_SIZE } from '../config/game.constants.js';
import { generateTileId } from '../utils/random.js';

export function generateInitialBoard(): BoardGrid {
  const board: BoardGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const forbiddenTypes = new Set<ElementType>();

      if (c >= 2 && board[r][c - 1]?.type === board[r][c - 2]?.type) {
        forbiddenTypes.add(board[r][c - 1]!.type);
      }

      if (r >= 2 && board[r - 1][c]?.type === board[r - 2][c]?.type) {
        forbiddenTypes.add(board[r - 1][c]!.type);
      }

      const availableTypes = ELEMENT_TYPES.filter((type) => !forbiddenTypes.has(type));
      const chosenType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      board[r][c] = {
        id: generateTileId(r, c),
        type: chosenType,
        row: r,
        col: c
      };
    }
  }

  return board;
}