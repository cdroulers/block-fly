import BoardParser from "../game/symbolsBoardParser";
import LevelSet from "../game/levelSet";
import publisher from "./publisher";
import * as Events from "./events";
import { showMessage, showErrorMessage } from "../display/messageDisplay";
import { writeToCanvas, getActualDimensions } from "../display/canvasDisplay";
import { IViewport, getViewport } from "../display/viewport";

const parser = new BoardParser();

export default class Controller {
  private _canvas: HTMLCanvasElement;
  private canvasTitle: HTMLDivElement;

  private levelSet: LevelSet;

  private viewportModifier: IViewport = { x: 0, y: 0 };

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  constructor() {
    this._canvas = document.getElementById("root") as HTMLCanvasElement;
    this.canvasTitle = document.querySelector("#level-indicator > div:first-child") as HTMLDivElement;

    publisher.subscribe(Events.EventType.LevelsLoaded, this.levelsLoaded.bind(this));
    publisher.subscribe(Events.EventType.PlayerMoved, this.playerMoved.bind(this));
    publisher.subscribe(Events.EventType.LevelReset, this.levelReset.bind(this));
    publisher.subscribe(Events.EventType.ViewportModified, this.viewportModified.bind(this));
    publisher.subscribe(Events.EventType.WentToLevelWithPassword, this.wentToLevelWithPassword.bind(this));

    window.addEventListener("resize", (e) => {
      this.updateCanvas();
    });
  }

  private levelsLoaded(event: Events.ILevelsLoadedEvent): void {
    this.levelSet = new LevelSet(event.levelSet, parser);

    this.levelSet.onLevelFinished = () => {
      showMessage("YOU WIN THIS LEVEL. Give yourself a high-five");
      this.levelSet.nextLevel();
      this.updateLevelTitle();
      this.updateCanvas();
    };

    this.levelSet.onSetFinished = () => {
      showMessage("YOU Finished all levels. Sweet Christmas!");
    };

    this.updateLevelTitle();
    this.updateCanvas();

    showMessage(`Loaded levels from "${this.levelSet.levelSet.name || "unknown"}"!`);
  }

  private playerMoved(event: Events.IPlayerMovedEvent): void {
    this.levelSet.currentLevel.move(event.playerId, event.move);

    this.updateCanvas();
  }

  private levelReset(event: Events.ILevelResetEvent): void {
    this.levelSet.currentLevel.reset();

    this.updateCanvas();
  }

  private wentToLevelWithPassword(event: Events.IWentToLevelWithPasswordEvent): void {
    try {
      this.levelSet.goToLevelWithPassword(event.password);
      this.updateCanvas();
      this.updateLevelTitle();
    } catch (e) {
      showErrorMessage(e.message);
    }
  }

  private updateCanvas(viewport?: IViewport): void {
    writeToCanvas(this.canvas, this.levelSet.currentLevel, viewport);
  }

  private updateLevelTitle(): void {
    const board = this.levelSet.currentLevel;
    this.canvasTitle.innerHTML = board.number +
      (board.name ? " - " + board.name : "") +
      (board.password ? " (password: " + board.password + ")" : "");
  }

  private viewportModified(event: Events.IViewportModified): void {
    const vpBefore = getViewport(
      this.levelSet.currentLevel,
      getActualDimensions(this.levelSet.currentLevel, window),
      this.viewportModifier);

    let newModifier = event.viewport;

    const vpAfter = getViewport(
      this.levelSet.currentLevel,
      getActualDimensions(this.levelSet.currentLevel, window),
      newModifier);

    if (vpBefore.x === vpAfter.x && vpBefore.y === vpAfter.y) {
      return;
    }

    this.viewportModifier = newModifier;
    this.updateCanvas(this.viewportModifier);
  }
}
