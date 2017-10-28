import { loadImages, imageSize } from "../display/canvasDisplay";
import { checkDrawerButton } from "../display/helpers";
import Controller from "./controller";
require("offline-plugin/runtime").install(); // tslint:disable-line no-require-imports no-var-requires

require("../stylesheets/site.style"); // tslint:disable-line no-require-imports no-var-requires
require("../stylesheets/editor.style"); // tslint:disable-line no-require-imports no-var-requires
require("material-design-lite/material.min"); // tslint:disable-line no-require-imports no-var-requires

init();

let controller: Controller = undefined;

function init(): void {
  loadImages().then(imgs => {
    window["controller"] = controller = new Controller(imgs);

    window.addEventListener("resize", e => {
      checkDrawerButton(controller.canvas, imageSize);
    });

    checkDrawerButton(controller.canvas, imageSize);
  });
}
