import { loadImages, imageSize } from "./display/canvasDisplay";
import { setupDialogs } from "./display/dialogHelpers";
import Controller from "./infrastructure/controller";

import "./stylesheets/site.style.scss";
import "material-design-lite/material.min.css";

setupDialogs();

init();

let controller: Controller = undefined!;

function init(): void {
  loadImages().then(() => {
    controller = new Controller();

    window.addEventListener("resize", () => {
      checkDrawerButton(controller.canvas);
    });

    checkDrawerButton(controller.canvas);
  });
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
