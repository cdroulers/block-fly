import * as Promise from "bluebird";

export function bindLevelsControls(callback: (levels: string[]) => void): void {
  let loadRemoteButton = document.getElementById("load-remote");
  loadRemoteButton.addEventListener("click", () => {
      let url = (document.getElementById("remote-path") as HTMLInputElement).value;

      if (url !== "") {
        getXHRLevels(url).then(callback)
        .catch((error: string): void => {
          alert(error);
        });
      } else {
        alert("Please enter an URL");
      }
  });

  let loadDefaultsButton = document.getElementById("load-defaults");
  loadDefaultsButton.addEventListener("click", () => {
    getDefaultLevels().then(callback)
    .catch((error: string): void => {
      alert(error);
    });
  });

  let loadLocalLevels = document.getElementById("load-file");
  loadLocalLevels.addEventListener("click", () => {
      let levelsFile = (document.getElementById("local-levels") as HTMLInputElement).files[0];

      if (levelsFile !== undefined) {
        getLevelsFromFile(levelsFile).then(callback)
        .catch((error: string): void => {
          alert(error);
        });
      } else {
        alert("Please choose a file");
      }
  });
}

export function getDefaultLevels(): Promise<string[]> {
  return getXHRLevels("assets/default-levels.json");
}

export function getXHRLevels(path: string): Promise<string[]> {
  return new Promise<string[]>((resolve: any, reject: any) => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", path);
    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(transformReponseToLevels(xhr.response));
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

export function getLevelsFromFile(file: File): Promise<string[]> {
  return new Promise<string[]>((resolve: any, reject: any) => {
    let reader = new FileReader();
    reader.onload = e => resolve(transformReponseToLevels(JSON.parse(reader.result)));
    reader.readAsText(file);
  });
}

function transformReponseToLevels(response: string[][]): string[] {
  let levels: string[] = [];

  for (let i = 0 ; i < response.length ; i++) {
    levels.push(response[i].join("\n"));
  }

  return levels;
}
