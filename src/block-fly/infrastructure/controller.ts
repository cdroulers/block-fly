import BoardParser from "../game/symbolsBoardParser";
import LevelSet from "../game/levelSet";
import { ILevelSet } from "../game/level";
import publisher from "./publisher";
import * as Events from "./events";
import { showMessage, showErrorMessage } from "../display/messageDisplay";
import { writeToCanvas, getActualDimensions } from "../display/canvasDisplay";
import { IViewport, getViewport } from "../display/viewport";
import { bindDefaultControls } from "../display/defaultControls";
import { bindMobileControls } from "../display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "../display/levelControls";
import { startFireworks } from "../display/fireworksDisplay";
import { LevelStorage } from "./levelStorage";

const parser = new BoardParser();
const levelStorage = new LevelStorage();

export default class Controller {
  public canvas: HTMLCanvasElement;
  private canvasTitle: HTMLDivElement;

  private levelSet!: LevelSet;

  private viewportModifier: IViewport = { x: 0, y: 0 };

  constructor() {
    this.canvas = document.getElementById("root") as HTMLCanvasElement;
    this.canvasTitle = document.querySelector(
      "#level-indicator > div:first-child"
    ) as HTMLDivElement;

    this.subscribeToEvents();

    this.startGame();

    window.addEventListener("resize", () => {
      this.updateCanvas();
    });
  }

  private subscribeToEvents(): void {
    publisher.subscribe(Events.EventType.LevelsLoaded, this.levelsLoaded.bind(this));
    publisher.subscribe(Events.EventType.PlayerMoved, this.playerMoved.bind(this));
    publisher.subscribe(Events.EventType.LevelReset, this.levelReset.bind(this));
    publisher.subscribe(Events.EventType.ViewportModified, this.viewportModified.bind(this));
    publisher.subscribe(
      Events.EventType.WentToLevelWithPassword,
      this.wentToLevelWithPassword.bind(this)
    );
  }

  private async startGame(): Promise<void> {
    bindLevelsControls();
    bindDefaultControls();
    bindMobileControls(this.canvas);

    try {
      const latest = await levelStorage.loadlatestLevels();
      if (latest) {
        this.loadLatestLevels(latest?.levelSet, latest?.password);
        return;
      }

      const levels = await getDefaultLevels();
      publisher.publish(Events.EventType.LevelsLoaded, {
        levelSet: levels,
      } as Events.ILevelsLoadedEvent);
    } catch (e) {
      showErrorMessage(e);
    }
  }

  private loadLatestLevels(levels: ILevelSet, password: string): void {
    publisher.publish(Events.EventType.LevelsLoaded, {
      levelSet: levels,
    } as Events.ILevelsLoadedEvent);
    const event = { password } as Events.IWentToLevelWithPasswordEvent;
    publisher.publish(Events.EventType.WentToLevelWithPassword, event);
  }

  private levelsLoaded(event: Events.ILevelsLoadedEvent): void {
    this.levelSet = new LevelSet(event.levelSet, parser);
    this.updateStoredLatestLevel();

    this.levelSet.onLevelFinished = () => {
      showMessage("YOU WIN THIS LEVEL. Give yourself a high-five");
      this.levelSet.nextLevel();
      this.updateStoredLatestLevel();
      startFireworks(5000);
      this.updateLevelTitle();
      this.updateCanvas();
    };

    this.levelSet.onSetFinished = () => {
      showMessage("YOU Finished all levels. Sweet Christmas!");
      startFireworks(15000);
    };

    this.updateLevelTitle();
    this.updateCanvas();

    showMessage(`Loaded levels from "${this.levelSet.levelSet.name || "unknown"}"!`);
  }

  private playerMoved(event: Events.IPlayerMovedEvent): void {
    this.levelSet.currentLevel.move(event.playerId, event.move);

    this.updateCanvas();
  }

  private levelReset(): void {
    this.levelSet.currentLevel.reset();

    this.updateCanvas();
  }

  private wentToLevelWithPassword(event: Events.IWentToLevelWithPasswordEvent): void {
    try {
      this.levelSet.goToLevelWithPassword(event.password);
      this.updateStoredLatestLevel();
      this.updateCanvas();
      this.updateLevelTitle();
    } catch (e: any) {
      showErrorMessage(e.message);
    }
  }

  private updateStoredLatestLevel(): void {
    levelStorage.storeLatestLevels(this.levelSet.levelSet.uri, this.levelSet.currentLevel.password);
  }

  private updateCanvas(viewport?: IViewport): void {
    writeToCanvas(this.canvas, this.levelSet.currentLevel, viewport);
  }

  private updateLevelTitle(): void {
    const board = this.levelSet.currentLevel;
    this.canvasTitle.innerHTML =
      board.number +
      (board.name ? " - " + board.name : "") +
      (board.password ? " (password: " + board.password + ")" : "");
  }

  private viewportModified(event: Events.IViewportModified): void {
    const vpBefore = getViewport(
      this.levelSet.currentLevel,
      getActualDimensions(this.levelSet.currentLevel, window),
      this.viewportModifier
    );

    let newModifier = event.viewport;

    const vpAfter = getViewport(
      this.levelSet.currentLevel,
      getActualDimensions(this.levelSet.currentLevel, window),
      newModifier
    );

    if (vpBefore.x === vpAfter.x && vpBefore.y === vpAfter.y) {
      return;
    }

    this.viewportModifier = newModifier;
    this.updateCanvas(this.viewportModifier);
  }
}
