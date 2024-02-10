import BoardParser from "../game/symbolsBoardParser";
import LevelSet from "../game/levelSet";
import { ILevelSet } from "../game/level";
import { showMessage } from "../display/messageDisplay";
import publisher from "../infrastructure/publisher";
import * as Events from "../infrastructure/events";
import { getDefaultLevels } from "../display/levelControls";
import { PieceType } from "../game/pieces";
import { writeToCanvas, imageSize } from "../display/canvasDisplay";
import { IViewport } from "../display/viewport";

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

    window.addEventListener("resize", (e) => {
      this.updateCanvas();
    });

    this.canvas.addEventListener("click", (e) => this.canvasClicked(e));
  }

  private canvasClicked(e: MouseEvent): void {
    const x = Math.floor(e.offsetX / imageSize),
      y = Math.floor(e.offsetY / imageSize);
    const p = this.levelSet.currentLevel.getPiece({ x, y });
    p.type = this.currentTile;
    this.updateCanvas();
  }

  private bindEvents(): void {
    const form = document.getElementById("level-information") as ILevelInformationForm;

    // On form submit, I guess save the levels? Probably will need a level picker
    console.log(form);
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
    event.levelSet.levels.map((x, i) => {
      const option = document.createElement("option");
      option.value = i.toString();
      option.innerText = x.name || "";
      levels.appendChild(option);
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
    // tslint:disable-next-line:no-unused-variable
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
        const img = map[key as unknown as PieceType];
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
