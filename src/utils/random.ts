import { ElementType } from '../interfaces/engine.interface.js';
import { ELEMENT_TYPES } from '../config/game.constants.js';

export function getRandomElement(): ElementType {
  return ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
}

export function generateTileId(row: number, col: number): string {
  return `t_${row}_${col}_${Math.random().toString(36).substring(2, 7)}`;
}