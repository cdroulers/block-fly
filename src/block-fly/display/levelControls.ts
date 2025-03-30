import { ITextLevel, ILevelSet } from "../game/level";
import { showErrorMessage } from "./messageDisplay";
import publisher from "../infrastructure/publisher";
import * as Events from "../infrastructure/events";
import Storage from "../infrastructure/storage";
import { config } from "../../config";

export function bindLevelsControls(): void {
  bindLoadRemoteLevels();

  bindLoadDefaultLevels();

  bindLoadChildrenLevels();

  bindLoadLocalLevels();

  bindGoToLevelWithPassword();
}

// Borrowed from http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
function qualifyURL(url: string): string {
  const a = document.createElement("a");
  a.href = url;
  return a.href;
}

export function getDefaultLevels(): Promise<ILevelSet> {
  return getRemoteLevels(config.basePath + "default-levels.json");
}

export function getRemoteLevels(path: string): Promise<ILevelSet> {
  return fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Cannot load levels; error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((json) => {
      const levels = transformReponseToLevels(json, qualifyURL(path));
      Storage.setItem(levels.uri, JSON.stringify(levels));
      return levels;
    });
}

export function getLevelsFromFile(file: File): Promise<ILevelSet> {
  return new Promise<ILevelSet>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const levels = transformReponseToLevels(
        JSON.parse(reader!.result!.toString()),
        "file:///" + file.name
      );
      Storage.setItem(levels.uri, JSON.stringify(levels));
      resolve(levels);
    };

    reader.readAsText(file);
  });
}

export function transformReponseToLevels(response: any, levelUri: string): ILevelSet {
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
        text: value,
      });
    } else if (Array.isArray(value)) {
      // Assume it's a simple array of strings.
      levels.push({
        name: undefined,
        number: i + 1,
        password: undefined,
        text: value.join("\n"),
      });
    } else {
      const text = Array.isArray(value.text) ? value.text.join("\n") : value.text;

      levels.push({
        name: value.name,
        number: value.number || i + 1,
        password: value.password,
        text,
      });
    }
  }

  return {
    name,
    uri: levelUri,
    levels,
  };
}

function bindLoadRemoteLevels(): void {
  const loadRemoteDialog = document.getElementById("load-remote-file-dialog") as HTMLDialogElement;

  const loadRemoteButton = document.getElementById("load-remote")!;
  loadRemoteButton.addEventListener("click", (e) => {
    e.preventDefault();

    loadRemoteDialog.showModal();
  });

  const loadRemoteLevelsForm = loadRemoteDialog.getElementsByTagName("form")[0];
  loadRemoteLevelsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("remote-levels") as HTMLInputElement;
    const url = input.value;

    if (url) {
      getRemoteLevels(url)
        .then((levels: ILevelSet) => {
          loadRemoteDialog.close();
          closeMenu();
          input.value = "";
          publisher.publish(Events.EventType.LevelsLoaded, {
            levelSet: levels,
          } as Events.ILevelsLoadedEvent);
          return levels;
        })
        .catch((error: string): void => {
          loadRemoteDialog.close();
          closeMenu();
          showErrorMessage(error);
        });
    } else {
      showErrorMessage("Please enter an URL");
    }
  });
}

function closeMenu(): void {
  // Hack to hide menu if it's been shown on a smaller screen.
  document.querySelector(".mdl-layout__drawer")!.classList.remove("is-visible");
  document.querySelector(".mdl-layout__obfuscator")!.classList.remove("is-visible");
}

function bindLoadDefaultLevels(): void {
  const loadDefaultsButton = document.getElementById("load-defaults")!;
  loadDefaultsButton.addEventListener("click", (e) => {
    e.preventDefault();
    getDefaultLevels()
      .then((levels: ILevelSet) => {
        closeMenu();
        publisher.publish(Events.EventType.LevelsLoaded, {
          levelSet: levels,
        } as Events.ILevelsLoadedEvent);
        return levels;
      })
      .catch((error: string): void => {
        closeMenu();
        showErrorMessage(error);
      });
  });
}

function bindLoadChildrenLevels(): void {
  const loadDefaultsButton = document.getElementById("children-levels")!;
  loadDefaultsButton.addEventListener("click", (e) => {
    e.preventDefault();
    getRemoteLevels(config.basePath + "children-levels.json")
      .then((levels: ILevelSet) => {
        closeMenu();
        publisher.publish(Events.EventType.LevelsLoaded, {
          levelSet: levels,
        } as Events.ILevelsLoadedEvent);
        return levels;
      })
      .catch((error: string): void => {
        closeMenu();
        showErrorMessage(error);
      });
  });
}

function bindLoadLocalLevels(): void {
  const loadLocalDialog = document.getElementById("load-local-file-dialog") as HTMLDialogElement;

  const loadLocalLevels = document.getElementById("load-local")!;
  loadLocalLevels.addEventListener("click", (e) => {
    e.preventDefault();
    loadLocalDialog.showModal();
  });

  const loadLocalLevelsForm = loadLocalDialog.getElementsByTagName("form")[0];
  loadLocalLevelsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("local-levels") as HTMLInputElement;
    const levelsFile = input.files?.[0];

    if (levelsFile) {
      getLevelsFromFile(levelsFile)
        .then((levels: ILevelSet) => {
          loadLocalDialog.close();
          closeMenu();
          input.value = "";
          publisher.publish(Events.EventType.LevelsLoaded, {
            levelSet: levels,
          } as Events.ILevelsLoadedEvent);
          return levels;
        })
        .catch((error: string): void => {
          loadLocalDialog.close();
          closeMenu();
          showErrorMessage(error);
        });
    } else {
      showErrorMessage("Please choose a file");
    }
  });
}

function bindGoToLevelWithPassword(): void {
  const goToLevelWithPasswordDialog = document.getElementById(
    "enter-password"
  ) as HTMLDialogElement;

  const goToLevelWithPasswordButton = document.getElementById("enter-password-link")!;
  goToLevelWithPasswordButton.addEventListener("click", (e) => {
    e.preventDefault();

    goToLevelWithPasswordDialog.showModal();
  });

  const submitPasswordForm = goToLevelWithPasswordDialog.getElementsByTagName("form")[0];
  submitPasswordForm.addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.getElementById("level-password") as HTMLInputElement;
    const password = input.value;

    if (password) {
      publisher.publish(Events.EventType.WentToLevelWithPassword, {
        password,
      } as Events.IWentToLevelWithPasswordEvent);
      input.value = "";
      goToLevelWithPasswordDialog.close();
      closeMenu();
    } else {
      showErrorMessage("Please enter a password");
    }
  });
}
