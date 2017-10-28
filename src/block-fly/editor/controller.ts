import BoardParser from "../game/symbolsBoardParser";
import LevelSet from "../game/levelSet";
import { PieceType } from "../game/pieces";
import { writeToCanvas, imageSize } from "../display/canvasDisplay";
import { IViewport } from "../display/viewport";

const parser = new BoardParser();

export default class Controller {
  public canvas: HTMLCanvasElement;

  private levelSet: LevelSet;
  private currentTile: PieceType = PieceType.Empty;

  constructor(private imgs: HTMLImageElement[]) {
    this.canvas = document.getElementById("root") as HTMLCanvasElement;

    this.bindEvents();

    this.subscribeToEvents();

    this.startEditor();

    this.createTiles();

    window.addEventListener("resize", e => {
      this.updateCanvas();
    });

    this.canvas.addEventListener("click", e => this.canvasClicked(e));
  }

  private canvasClicked(e: MouseEvent): void {
    const { offsetX, offsetY } = e;
    const x = Math.floor(offsetX / imageSize);
    const y = Math.floor(offsetY / imageSize);
    const p = this.levelSet.currentLevel.getPiece({ x, y });
    p.type = this.currentTile;
    this.updateCanvas();
  }

  private bindEvents(): void {
    const form = document.getElementById("level-information") as ILevelInformationForm;

    // On form submit, I guess save the levels? Probably will need a level picker
    console.log(form);
  }

  private subscribeToEvents(): void {
    // Will subscribe when loading and stuff. Code re-use is needed!
  }

  private startEditor(): void {
    this.levelSet = new LevelSet(
      {
        levels: [
          {
            name: "Level 1",
            number: 1,
            password: "TEST",
            text: `
          ######
          #    #
          #    #
          #    #
          #D   #
          ##B P#
          ######
          `
          }
        ],
        name: "EDITOR LEVELS",
        uri: "/wot.json"
      },
      parser
    );
    this.updateCanvas();
  }

  private createTiles(): void {
    // tslint:disable-next-line:no-unused-variable
    const [player1Left, _, empty, wall, block, door] = this.imgs;

    const map = {
      [PieceType.Player]: player1Left,
      [PieceType.Empty]: empty,
      [PieceType.Wall]: wall,
      [PieceType.Block]: block,
      [PieceType.Door]: door
    };

    const list = document.getElementById("tiles");
    for (let key in Object.keys(map)) {
      if (map.hasOwnProperty(key)) {
        const img = map[key];
        const li = document.createElement("li");
        li.appendChild(img);
        list.appendChild(li);
        li.addEventListener("click", () => this.setCurrentTile(parseInt(key, 10) as PieceType));
      }
    }
  }

  private setCurrentTile(tile: PieceType): void {
    this.currentTile = tile;
    console.log(this.currentTile);
  }

  private updateCanvas(viewport?: IViewport): void {
    writeToCanvas(this.canvas, this.levelSet.currentLevel, viewport, true);
  }
}

interface ILevelInformationForm extends HTMLFormElement {
  level_name: HTMLInputElement;

  number: HTMLInputElement;

  password: HTMLInputElement;
}
