import * as Promise from "bluebird";
import { ITextLevel } from "../game/level";

export function bindLevelsControls(callback: (levels: ITextLevel[]) => void): void {
  let loadRemoteButton = document.getElementById("load-remote");
  loadRemoteButton.addEventListener("click", () => {
    let url = (document.getElementById("remote-path") as HTMLInputElement).value;

    if (url !== "") {
      getXHRLevels(url)
        .then(callback)
        .catch((error: string): void => {
          alert(error);
        });
    } else {
      alert("Please enter an URL");
    }
  });

  let loadDefaultsButton = document.getElementById("load-defaults");
  loadDefaultsButton.addEventListener("click", () => {
    getDefaultLevels()
      .then(callback)
      .catch((error: string): void => {
        alert(error);
      });
  });

  let loadLocalLevels = document.getElementById("load-file");
  loadLocalLevels.addEventListener("click", () => {
    let levelsFile = (document.getElementById("local-levels") as HTMLInputElement).files[0];

    if (levelsFile !== undefined) {
      getLevelsFromFile(levelsFile)
        .then(callback)
        .catch((error: string): void => {
          alert(error);
        });
    } else {
      alert("Please choose a file");
    }
  });
}

export function getDefaultLevels(): Promise<ITextLevel[]> {
  return getXHRLevels("assets/default-levels.json");
}

export function getXHRLevels(path: string): Promise<ITextLevel[]> {
  return new Promise<ITextLevel[]>((resolve: any, reject: any) => {
    let xhr = new XMLHttpRequest();

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

export function getLevelsFromFile(file: File): Promise<ITextLevel[]> {
  return new Promise<ITextLevel[]>((resolve: any, reject: any) => {
    let reader = new FileReader();
    reader.onload = e => resolve(transformReponseToLevels(JSON.parse(reader.result)));
    reader.readAsText(file);
  });
}

function transformReponseToLevels(response: any[]): ITextLevel[] {
  let levels: ITextLevel[] = [];

  for (let i = 0; i < response.length; i++) {
    const value = response[i];
    if (Array.isArray(value)) {
      // Assume it's a simple string;
      levels.push({
        number: i + 1,
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

  return levels;
}
