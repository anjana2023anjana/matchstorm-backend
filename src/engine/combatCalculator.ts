import { MatchGroup } from '../interfaces/engine.interface.js';
import { BASE_DAMAGE_PER_TILE, COMBO_MULTIPLIER } from '../config/game.constants.js';

export function calculateRoundCombat(
  matches: MatchGroup[],
  comboIndex: number
): { damage: number; shield: number } {
  let damage = 0;
  let shield = 0;

  for (const match of matches) {
    const tileCount = match.tiles.length;
    const baseValue = tileCount * BASE_DAMAGE_PER_TILE;

    if (match.type === 'SHIELD') {
      shield += baseValue;
    } else {
      damage += Math.round(baseValue * Math.pow(COMBO_MULTIPLIER, comboIndex));
    }
  }

  return { damage, shield };
}