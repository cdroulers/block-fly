import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { ITextLevel } from "./game/level";
import { Board } from "./game/board";
import { writeToCanvas, loadImages } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";

const canvas = document.getElementById("root") as HTMLCanvasElement;
const canvasTitle = document.querySelector("#level-indicator > div:first-child") as HTMLDivElement;

const parser = new BoardParser();

init();

function init(): void {
  loadImages().then(() => {
    bindLevelsControls(initGame);

    getDefaultLevels()
      .then(initGame);
  });
}

export function initGame(levels: ITextLevel[]): ITextLevel[] {
  const levelSet = new LevelSet(levels, parser);

  levelSet.onLevelFinished = () => {
    alert("YOU WIN THIS LEVEL. Give yourself a high-five");
    levelSet.nextLevel();
    updateLevelTitle(levelSet.currentLevel);
    writeToCanvas(canvas, levelSet.currentLevel);
  };

  levelSet.onSetFinished = () => {
    alert("YOU Finished all levels. Sweet Christmas!");
  };

  updateLevelTitle(levelSet.currentLevel);
  writeToCanvas(canvas, levelSet.currentLevel);

  bindDefaultControls(canvas, levelSet);
  bindMobileControls(canvas, levelSet);

  return levels;
}

function updateLevelTitle(board: Board): void {
  canvasTitle.innerHTML = board.number + (board.name ? " - " + board.name : "");
}
