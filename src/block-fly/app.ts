import { ILevelSet } from "./game/level";
import { loadImages, imageSize } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";
import { getDefaultLevels, bindLevelsControls } from "./display/levelControls";
import { setupDialogs } from "./display/dialogHelpers";
import publisher from "./infrastructure/publisher";
import * as Events from "./infrastructure/events";
import Controller from "./infrastructure/controller";

require("./stylesheets/site.style"); // tslint:disable-line no-require-imports no-var-requires
require("material-design-lite/material.min"); // tslint:disable-line no-require-imports no-var-requires

setupDialogs();

const controller = new Controller();

init();

function init(): void {
  loadImages().then(() => {
    bindLevelsControls();
    bindDefaultControls();
    bindMobileControls(controller.canvas);

    getDefaultLevels()
      .then((levels: ILevelSet) => {
        publisher.publish(Events.EventType.LevelsLoaded, { levelSet: levels } as Events.ILevelsLoadedEvent);
      });
  });

  window.addEventListener("resize", (e) => {
    checkDrawerButton(controller.canvas);
  });

  checkDrawerButton(controller.canvas);
}

function checkDrawerButton(canvas: HTMLElement): void {
  const drawerButton = document.querySelector(".mdl-layout__drawer-button");

  if (!drawerButton) {
    setTimeout(() => checkDrawerButton(canvas), 50);
    return;
  }

  if (canvas.offsetLeft < imageSize) {
    drawerButton.classList.add("over-game");
  } else {
    drawerButton.classList.remove("over-game");
  }
}
