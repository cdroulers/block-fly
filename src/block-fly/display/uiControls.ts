import { getXHRLevels, getLevelsFromFile, getDefaultLevels } from "./levelControls";
import { initGame } from "../app";

export function bindUiControls(): void {
  let loadRemoteButton = document.getElementById("load-remote");
  loadRemoteButton.addEventListener("click", () => {
      let url = (document.getElementById("remote-path") as HTMLInputElement).value;

      if (url !== "") {
        getXHRLevels(url).then(initGame)
        .catch((error: string): void => {
          alert(error);
        });
      } else {
        alert("Please enter an URL");
      }
  });

  let loadDefaultsButton = document.getElementById("load-defaults");
  loadDefaultsButton.addEventListener("click", () => {
    getDefaultLevels().then(initGame)
    .catch((error: string): void => {
      alert(error);
    });
  });

  let loadLocalLevels = document.getElementById("load-file");
  loadLocalLevels.addEventListener("click", () => {
      let levelsFile = (document.getElementById("local-levels") as HTMLInputElement).files[0];

      if (levelsFile !== undefined) {
        getLevelsFromFile(levelsFile).then(initGame)
        .catch((error: string): void => {
          alert(error);
        });
      } else {
        alert("Please choose a file");
      }
  });
}
