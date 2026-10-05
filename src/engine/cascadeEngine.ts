import { BoardGrid, CascadeStep } from '../interfaces/engine.interface.js';
import { GRID_SIZE } from '../config/game.constants.js';
import { detectMatches } from './matchDetector.js';
import { calculateRoundCombat } from './combatCalculator.js';
import { getRandomElement, generateTileId } from '../utils/random.js';

export function executeFullCascade(initialBoard: BoardGrid): {
  finalBoard: BoardGrid;
  steps: CascadeStep[];
  totalDamage: number;
  totalShield: number;
} {
  const currentBoard: BoardGrid = initialBoard.map((row) => [...row]);
  const steps: CascadeStep[] = [];
  let totalDamage = 0;
  let totalShield = 0;
  let comboIndex = 0;

  while (true) {
    const matches = detectMatches(currentBoard);
    if (matches.length === 0) break;

    const { damage: stepDamage, shield: stepShield } = calculateRoundCombat(matches, comboIndex);
    totalDamage += stepDamage;
    totalShield += stepShield;

    const matchIds = new Set(matches.flatMap((m) => m.tiles.map((t) => t.id)));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentBoard[r][c] && matchIds.has(currentBoard[r][c]!.id)) {
          currentBoard[r][c] = null;
        }
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (currentBoard[r][c] !== null) {
          if (emptyRow !== r) {
            currentBoard[emptyRow][c] = {
              ...currentBoard[r][c]!,
              row: emptyRow,
              col: c
            };
            currentBoard[r][c] = null;
          }
          emptyRow--;
        }
      }

      for (let r = emptyRow; r >= 0; r--) {
        currentBoard[r][c] = {
          id: generateTileId(r, c),
          type: getRandomElement(),
          row: r,
          col: c
        };
      }
    }

    steps.push({
      board: currentBoard.map((row) => [...row]),
      clearedMatches: matches,
      damage: stepDamage,
      shieldGain: stepShield
    });

    comboIndex++;
  }

  return { finalBoard: currentBoard, steps, totalDamage, totalShield };
}