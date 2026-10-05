import { ElementType } from '../interfaces/engine.interface.js';

export const GRID_SIZE = 8;
export const MAX_HP = 1000;
export const BASE_DAMAGE_PER_TILE = 10;
export const COMBO_MULTIPLIER = 1.25;

export const ELEMENT_TYPES: readonly ElementType[] = [
  'FIRE',
  'WATER',
  'EARTH',
  'ELECTRIC',
  'SHIELD'
] as const;
