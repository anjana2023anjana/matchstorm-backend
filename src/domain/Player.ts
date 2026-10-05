import { BoardGrid } from '../interfaces/engine.interface.js';
import { MAX_HP } from '../config/game.constants.js';

export class Player {
  public hp: number = MAX_HP;
  public shield: number = 0;

  constructor(
    public readonly socketId: string,
    public readonly userId: string,
    public readonly username: string,
    public board: BoardGrid
  ) {}

  public applyDamage(incomingDmg: number): void {
    if (this.shield > 0) {
      if (this.shield >= incomingDmg) {
        this.shield -= incomingDmg;
        return;
      } else {
        incomingDmg -= this.shield;
        this.shield = 0;
      }
    }
    this.hp = Math.max(0, this.hp - incomingDmg);
  }
}