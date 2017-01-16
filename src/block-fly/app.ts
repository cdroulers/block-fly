import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { ILevelSet } from "./game/level";
import { Board } from "./game/board";
import { writeToCanvas, loadImages } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";
import { showMessage } from "./display/messageDisplay";
import { setupDialogs } from "./display/dialogHelpers";

require("./stylesheets/site.style"); // tslint:disable-line no-require-imports no-var-requires
require("material-design-lite/material.min"); // tslint:disable-line no-require-imports no-var-requires

const canvas = document.getElementById("root") as HTMLCanvasElement;
const canvasTitle = document.querySelector("#level-indicator > div:first-child") as HTMLDivElement;

setupDialogs();

const parser = new BoardParser();

init();

function init(): void {
  loadImages().then(() => {
    bindLevelsControls(initGame);

    getDefaultLevels()
      .then(initGame);
  });
}

export function initGame(levels: ILevelSet): ILevelSet {
  const levelSet = new LevelSet(levels, parser);

  showMessage(`Loaded levels from "${levels.name || "unknown"}"!`);

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
  canvasTitle.innerHTML = board.number +
    (board.name ? " - " + board.name : "") +
    (board.password ? " (password: " + board.password + ")" : "");
}
