import { loadImages, imageSize } from "./display/canvasDisplay";
import { checkDrawerButton } from "./display/helpers";
import { setupDialogs } from "./display/dialogHelpers";
import Controller from "./infrastructure/controller";
require("offline-plugin/runtime").install(); // tslint:disable-line no-require-imports no-var-requires

require("./stylesheets/site.style"); // tslint:disable-line no-require-imports no-var-requires
require("material-design-lite/material.min"); // tslint:disable-line no-require-imports no-var-requires

setupDialogs();

init();

let controller: Controller = undefined;

function init(): void {
  loadImages().then(() => {
    controller = new Controller();

    window.addEventListener("resize", (e) => {
      checkDrawerButton(controller.canvas, imageSize);
    });

    checkDrawerButton(controller.canvas, imageSize);
  });
}
