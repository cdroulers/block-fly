import * as Promise from "bluebird";
import { ITextLevel, ILevelSet } from "../game/level";
import LevelSet from "../game/levelSet";
import { showErrorMessage } from "./messageDisplay";
import { writeToCanvas } from "./canvasDisplay";

export function bindLevelsControls(
  callback: (levels: ILevelSet) => void,
  levelSetAccessor: () => LevelSet,
  canvas: HTMLCanvasElement
): void {
  bindLoadRemoteLevels(callback);

  bindLoadDefaultLevels(callback);

  bindLoadLocalLevels(callback);

  bindGoToLevelWithPassword(levelSetAccessor, canvas);
}

export function getDefaultLevels(): Promise<ILevelSet> {
  return getXHRLevels("assets/default-levels.json");
}

export function getXHRLevels(path: string): Promise<ILevelSet> {
  return new Promise<ILevelSet>((resolve: any, reject: any) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", path);
    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status === 200) {
        const json = typeof xhr.response === "string" ?
          JSON.parse(xhr.response) :
          xhr.response;
        resolve(transformReponseToLevels(json));
      } else {
        reject(Error("Cannot load levels; error : " + xhr.statusText));
      }
    };

    xhr.onerror = () => {
      reject(Error("There was a network error."));
    };

    xhr.send();
  });
}

export function getLevelsFromFile(file: File): Promise<ILevelSet> {
  return new Promise<ILevelSet>((resolve: any, reject: any) => {
    const reader = new FileReader();
    reader.onload = e => resolve(transformReponseToLevels(JSON.parse(reader.result)));
    reader.readAsText(file);
  });
}

export function transformReponseToLevels(response: any): ILevelSet {
  let levels: ITextLevel[] = [];

  let name = undefined;
  if (!Array.isArray(response)) {
    name = response.name;
    response = response.levels;
  }

  for (let i = 0; i < response.length; i++) {
    const value = response[i];
    if (typeof value === "string") {
      // Assume it's a simple string.
      levels.push({
        name: undefined,
        number: i + 1,
        password: undefined,
        text: value
      });
    } else if (Array.isArray(value)) {
      // Assume it's a simple array of strings.
      levels.push({
        name: undefined,
        number: i + 1,
        password: undefined,
        text: value.join("\n")
      });
    } else {
      const text = Array.isArray(value.text) ? value.text.join("\n") : value.text;

      levels.push({
        name: value.name,
        number: value.number || i + 1,
        password: value.password,
        text
      });
    }
  }

  return {
    name,
    levels
  };
}

function bindLoadRemoteLevels(callback: (levels: ILevelSet) => void): void {
  const loadRemoteDialog = document.getElementById("load-remote-file-dialog") as HTMLDialogElement;

  const loadRemoteButton = document.getElementById("load-remote");
  loadRemoteButton.addEventListener("click", (e) => {
    e.preventDefault();

    loadRemoteDialog.showModal();
  });

  const loadRemoteLevelsButton = document.getElementById("load-remote-levels");
  loadRemoteLevelsButton.addEventListener("click", (e) => {
    const url = (document.getElementById("remote-levels") as HTMLInputElement).value;

    if (url) {
      getXHRLevels(url)
        .then((levels: ILevelSet) => {
          loadRemoteDialog.close();
          callback(levels);
          return levels;
        })
        .catch((error: string): void => {
          showErrorMessage(error);
        });
    } else {
      showErrorMessage("Please enter an URL");
    }
  });
}

function bindLoadDefaultLevels(callback: (levels: ILevelSet) => void): void {
  const loadDefaultsButton = document.getElementById("load-defaults");
  loadDefaultsButton.addEventListener("click", (e) => {
    e.preventDefault();
    getDefaultLevels()
      .then((levels: ILevelSet) => {
        // Hack to hide menu if it's been shown on a smaller screen.
        document.querySelector(".mdl-layout__drawer").classList.remove("is-visible");
        document.querySelector(".mdl-layout__obfuscator").classList.remove("is-visible");
        callback(levels);
        return levels;
      })
      .catch((error: string): void => {
        showErrorMessage(error);
      });
  });
}

function bindLoadLocalLevels(callback: (levels: ILevelSet) => void): void {
  const loadLocalDialog = document.getElementById("load-local-file-dialog") as HTMLDialogElement;

  const loadLocalLevels = document.getElementById("load-local");
  loadLocalLevels.addEventListener("click", (e) => {
    e.preventDefault();
    loadLocalDialog.showModal();
  });

  const loadLocalLevelsButton = document.getElementById("load-local-levels");
  loadLocalLevelsButton.addEventListener("click", (e) => {
    e.preventDefault();
    const levelsFile = (document.getElementById("local-levels") as HTMLInputElement).files[0];

    if (levelsFile) {
      getLevelsFromFile(levelsFile)
        .then((levels: ILevelSet) => {
          loadLocalDialog.close();
          callback(levels);
          return levels;
        })
        .catch((error: string): void => {
          showErrorMessage(error);
        });
    } else {
      showErrorMessage("Please choose a file");
    }
  });
}

function bindGoToLevelWithPassword(
  levelSetAccessor: () => LevelSet,
  canvas: HTMLCanvasElement
): void {
  const goToLevelWithPasswordDialog = document.getElementById("enter-password") as HTMLDialogElement;

  const goToLevelWithPasswordButton = document.getElementById("enter-password-link");
  goToLevelWithPasswordButton.addEventListener("click", (e) => {
    e.preventDefault();

    goToLevelWithPasswordDialog.showModal();
  });

  const submitPasswordButton = document.getElementById("load-level-with-password");
  submitPasswordButton.addEventListener("click", (e) => {
    const password = (document.getElementById("level-password") as HTMLInputElement).value;

    if (password) {
      const levelSet = levelSetAccessor();
      try {
        levelSet.goToLevelWithPassword(password);
        goToLevelWithPasswordDialog.close();
        writeToCanvas(canvas, levelSet.currentLevel);
      } catch (e) {
        showErrorMessage(e.message);
      }
    } else {
      showErrorMessage("Please enter a password");
    }
  });
}
