import { IBoardParser } from "./boardParser";
import { Board } from "./board";
import { ITextLevel } from "./level";

export default class LevelSet {
  private currentLevelIndex: number;

  public currentLevel: Board;

  public onLevelFinished: (n: number) => void;

  public onSetFinished: () => void;

  public constructor(
    public levels: ITextLevel[] | string[],
    private boardParser: IBoardParser
  ) {
    this.currentLevelIndex = -1;
    this.levels = levels;

    this.nextLevel();
  }

  public nextLevel(): void {
    this.currentLevelIndex++;

    if (this.currentLevelIndex >= this.levels.length && this.onSetFinished) {
      this.onSetFinished();
      return;
    }

    this.currentLevel = this.boardParser.parse(this.levels[this.currentLevelIndex]);
    this.currentLevel.onWin = () => {
      if (this.onLevelFinished) {
        this.onLevelFinished(this.currentLevelIndex);
      }
    };
  }
}
