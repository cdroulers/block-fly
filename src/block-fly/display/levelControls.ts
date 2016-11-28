import * as Promise from "bluebird";

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
