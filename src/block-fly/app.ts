import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { writeToCanvas } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import * as Promise from "bluebird";

const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();

initDefaultLevels();

let loadRemoteButton = document.getElementById("load-remote");
loadRemoteButton.addEventListener("click", function(): void {
    let url = (document.getElementById("remote-path") as HTMLInputElement).value;

    if (url !== "") {
      getXHRLevels(url).then(initGame)
      .catch((error: string): void => {
        alert("Unable to find levels");
      });
    } else {
      alert("Please enter an URL");
    }
});

let loadDefaultsButton = document.getElementById("load-defaults");
loadDefaultsButton.addEventListener("click", function(): void {
    initDefaultLevels();
});

let loadLocalLevels = document.getElementById("local-levels");
loadLocalLevels.addEventListener("change", function(): void {
    let levelsFile = (loadLocalLevels as HTMLInputElement).files[0];

    let reader = new FileReader();
    reader.onload = e => initGame(transformReponseToLevels(JSON.parse(reader.result)));
    reader.readAsText(levelsFile);
});

function initDefaultLevels(): void {
  getXHRLevels("assets/default-levels.json").then(initGame)
  .catch((error: string): void => {
    alert("Unable to find levels");
  });
}

function initGame(levels: string[]): void {
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

function transformReponseToLevels(response: string[][]): string[] {
  let levels: string[] = [];

  for (let i = 0 ; i < response.length ; i++) {
    levels.push(response[i].join("\n"));
  }

  return levels;
}

function getXHRLevels(path: string): Promise<string[]> {
  return new Promise<string[]>(function(resolve: any, reject: any): void {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", path);
    xhr.responseType = "json";

    xhr.onload = function(): any {
      if (xhr.status === 200) {
        resolve(transformReponseToLevels(xhr.response));
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
