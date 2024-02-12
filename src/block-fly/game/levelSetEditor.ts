import { IBoardParser } from "./boardParser";
import { ILevelSet } from "./level";
import { ICoordinates } from "./coordinates";
import { PieceType } from "./pieces";
import LevelSet from "./levelSet";

export class LevelSetEditor extends LevelSet {
  public constructor(levelSet: ILevelSet, boardParser: IBoardParser) {
    super(levelSet, boardParser);
  }

  public goToLevel(levelNumber: number): void {
    const idx = this.levelSet.levels.findIndex((x) => x.number == levelNumber);
    this.currentLevelIndex = idx;

    this.setUpCurrentLevel();
  }

  public replacePiece(coords: ICoordinates, pieceType: PieceType, parser: IBoardParser): void {
    const piece = this.currentLevel.getPiece(coords);
    piece.type = pieceType;
    this.levelSet.levels[this.currentLevelIndex].text = parser.asString(this.currentLevel);
  }

  public updateInformation(name: string, levelNumber: number, password: string): void {
    this.levelSet.levels[this.currentLevelIndex].name = name;
    this.levelSet.levels[this.currentLevelIndex].number = levelNumber;
    this.levelSet.levels[this.currentLevelIndex].password = password;
  }

  public addLevel(): void {
    const biggest = this.levelSet.levels.reduce((p, c) => Math.max(p, c.number), 0) + 1;
    this.levelSet.levels = [
      ...this.levelSet.levels,
      {
        name: "NEW LEVEL " + biggest,
        number: biggest,
        text: "#        \n#        \n#        \n#        \n#        \n#      P \n#########",
        password: "",
      },
    ];
  }

  public removeLevel(): void {
    this.levelSet.levels.splice(this.currentLevelIndex, 1);
    const smallest = this.levelSet.levels.reduce((p, c) => Math.min(p, c.number), 0) + 1;
    this.goToLevel(smallest);
  }
}
