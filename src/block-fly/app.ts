import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { writeToCanvas, loadImages } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";

const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();

init();

function init(): void {
  loadImages().then(() => {
    bindLevelsControls(initGame);

    getDefaultLevels()
      .then(initGame);
  });
}

export function initGame(levels: string[]): string[] {
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

  return levels;
}
