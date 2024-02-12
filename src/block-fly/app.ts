import { loadImages, imageSize } from "./display/canvasDisplay";
import { checkDrawerButton } from "./display/helpers";
import { setupDialogs } from "./display/dialogHelpers";
import Controller from "./infrastructure/controller";

import "material-design-lite/material.min.css";
import "./stylesheets/site.style.scss";

setupDialogs();

init();

let controller: Controller = undefined!;

function init(): void {
  loadImages().then(() => {
    controller = new Controller();

    window.addEventListener("resize", () => {
      checkDrawerButton(controller.canvas, imageSize);
    });

    checkDrawerButton(controller.canvas, imageSize);
  });
}
