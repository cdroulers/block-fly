import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { ITextLevel } from "./game/level";
import { Board } from "./game/board";
import { writeToCanvas, loadImages } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";
import { showMessage } from "./display/messageDisplay";

require("./site.style"); // tslint:disable-line no-require-imports no-var-requires

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
    showMessage("YOU WIN THIS LEVEL. Give yourself a high-five");
    levelSet.nextLevel();
    updateLevelTitle(levelSet.currentLevel);
    writeToCanvas(canvas, levelSet.currentLevel);
  };

  levelSet.onSetFinished = () => {
    showMessage("YOU Finished all levels. Sweet Christmas!");
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
