export type ElementType = 'FIRE' | 'WATER' | 'EARTH' | 'ELECTRIC' | 'SHIELD';

export interface Tile {
  id: string;
  type: ElementType;
  row: number;
  col: number;
}

export type BoardGrid = (Tile | null)[][];

export interface SwapAction {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

export interface MatchGroup {
  type: ElementType;
  tiles: Tile[];
}

export interface CascadeStep {
  board: BoardGrid;
  clearedMatches: MatchGroup[];
  damage: number;
  shieldGain: number;
}