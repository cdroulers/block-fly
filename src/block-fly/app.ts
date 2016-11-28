import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { writeToCanvas } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";

const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();

init();

function init(): void {
  bindLevelsControls(initGame);

  getDefaultLevels().then(initGame)
  .catch((error: string): void => {
    alert(error);
  });
}

export function initGame(levels: string[]): void {
  const levelSet = new LevelSet(levels, parser);

  levelSet.onLevelFinished = () => {
    alert("YOU WIN THIS LEVEL. Give yourself a high-five");
    levelSet.nextLevel();
    writeToCanvas(canvas, levelSet.currentLevel);
  };

  levelSet.onSetFinished = () => {
    alert("YOU Finished all levels. Sweet Christmas!");
  };

  writeToCanvas(canvas, levelSet.currentLevel);

  bindDefaultControls(canvas, levelSet);
  bindMobileControls(canvas, levelSet);
}
