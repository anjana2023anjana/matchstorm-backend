import { BoardGrid, SwapAction } from '../interfaces/engine.interface.js';
import { detectMatches } from './matchDetector.js';

export function validateAndSimulateSwap(
  board: BoardGrid,
  swap: SwapAction
): { isValid: boolean; newBoard?: BoardGrid } {
  const { from, to } = swap;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);

  if (rowDiff + colDiff !== 1) {
    return { isValid: false };
  }

  const simulated: BoardGrid = board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
  const tileA = simulated[from.row][from.col];
  const tileB = simulated[to.row][to.col];

  if (!tileA || !tileB) return { isValid: false };

  simulated[from.row][from.col] = { ...tileB, row: from.row, col: from.col };
  simulated[to.row][to.col] = { ...tileA, row: to.row, col: to.col };

  const matches = detectMatches(simulated);
  if (matches.length === 0) {
    return { isValid: false };
  }

  return { isValid: true, newBoard: simulated };
}