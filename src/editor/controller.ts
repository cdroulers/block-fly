import BoardParser from "../block-fly/game/symbolsBoardParser";
import LevelSet from "../block-fly/game/levelSet";
import { ILevelSet } from "../block-fly/game/level";
import { showMessage } from "../block-fly/display/messageDisplay";
import publisher from "../block-fly/infrastructure/publisher";
import * as Events from "../block-fly/infrastructure/events";
import { getDefaultLevels } from "../block-fly/display/levelControls";
import { PieceType } from "../block-fly/game/pieces";
import { writeToCanvas, imageSize } from "../block-fly/display/canvasDisplay";
import { IViewport } from "../block-fly/display/viewport";

const parser = new BoardParser();

export default class Controller {
  public canvas: HTMLCanvasElement;

  private levelSet!: LevelSet;
  private currentTile: PieceType = PieceType.Empty;

  constructor(private imgs: HTMLImageElement[]) {
    this.canvas = document.getElementById("root") as HTMLCanvasElement;

    this.bindEvents();

    this.subscribeToEvents();

    this.startEditor();

    this.createTiles();

    window.addEventListener("resize", () => {
      this.updateCanvas();
    });

    this.canvas.addEventListener("click", (e) => this.canvasClicked(e));
  }

  private canvasClicked(e: MouseEvent): void {
    const x = Math.floor(e.offsetX / imageSize),
      y = Math.floor(e.offsetY / imageSize);
    this.levelSet.replacePiece({ x, y }, this.currentTile, parser);
    this.updateCanvas();
  }

  private bindEvents(): void {
    const form = document.getElementById("level-information") as ILevelInformationForm;

    form.addEventListener("change", () => {
      this.levelSet.updateInformation(
        form.level_name.value,
        parseInt(form.number.value, 10),
        form.password.value
      );
    });
  }

  private updateLevelInformation(): void {
    const form = document.getElementById("level-information") as ILevelInformationForm;
    const info = this.levelSet.currentLevel;

    form.level_name.value = info.name;
    form.number.value = (info.number || "").toString();
    form.password.value = info.password;
  }

  private subscribeToEvents(): void {
    publisher.subscribe(Events.EventType.LevelsLoaded, this.levelsLoaded.bind(this));
  }

  private levelsLoaded(event: Events.ILevelsLoadedEvent): void {
    this.levelSet = new LevelSet(event.levelSet, parser);
    this.updateCanvas();

    this.updateLevelInformation();
    showMessage(`Loaded levels from "${this.levelSet.levelSet.name || "unknown"}"!`);

    const levels = document.getElementById("levels")!;
    levels.innerHTML = "";
    event.levelSet.levels.map((x) => {
      const option = document.createElement("option");
      option.value = x.number.toString();
      option.selected = this.levelSet.currentLevel.number == x.number;
      option.innerText = x.name || "";
      levels.appendChild(option);
    });

    levels.addEventListener("change", (e) => {
      const newLevel = parseInt((e.target as HTMLSelectElement).value, 10);
      this.levelSet.goToLevel(newLevel);
      this.updateLevelInformation();
      this.updateCanvas();
    });
  }

  private startEditor(): void {
    getDefaultLevels().then((levels: ILevelSet) => {
      publisher.publish(Events.EventType.LevelsLoaded, {
        levelSet: levels,
      } as Events.ILevelsLoadedEvent);
    });
  }

  private createTiles(): void {
    const [player1Left, _, empty, wall, block, door] = this.imgs;

    const map: Record<PieceType, HTMLImageElement> = {
      [PieceType.Player]: player1Left,
      [PieceType.Empty]: empty,
      [PieceType.Wall]: wall,
      [PieceType.Block]: block,
      [PieceType.Door]: door,
    };

    const list = document.getElementById("tiles")!;
    for (let key in Object.keys(map)) {
      if (map.hasOwnProperty(key)) {
        const pieceType = parseInt(key, 10) as PieceType;
        const img = map[pieceType];
        const li = document.createElement("li");
        li.appendChild(img);
        list.appendChild(li);
        li.addEventListener("click", () => this.setCurrentTile(pieceType));
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
