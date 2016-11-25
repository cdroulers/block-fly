import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { writeToCanvas } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import * as Promise from "bluebird";

const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();

getLevels().then(
  function(response: string[]): void {
    const levels = response;

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
  },
  function(error: string): void {
    console.log(error);
  });

function getLevels(): Promise<string[]> {
  return new Promise<string[]>(function(resolve: any, reject: any): void {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "/assets/default-levels.json");
    xhr.responseType = "json";

    xhr.onload = function(): any {
      let levels: string[] = [];

      if (xhr.status === 200) {
        for (let i = 0 ; i < xhr.response.length ; i++) {
          levels.push(xhr.response[i].join("\n"));
        }

        resolve(levels);
      } else {
        reject(Error("Cannot load levels; error :" + xhr.statusText));
      }
    };

    xhr.onerror = function(): any {
      reject(Error("There was a network error."));
    };

    xhr.send();
  });
}
