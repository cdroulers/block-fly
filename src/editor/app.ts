import { loadImages, imageSize } from "../block-fly/display/canvasDisplay";
import { checkDrawerButton } from "../block-fly/display/helpers";
import Controller from "./controller";
import { config } from "../config";

import "material-design-lite/material.min.css";
import "../block-fly/stylesheets/site.style.scss";
import "./app.style.scss";

config.basePath = "../";

init();

let controller: Controller = undefined!;

function init(): void {
  loadImages().then((imgs) => {
    (window as any)["controller"] = controller = new Controller(imgs);

    window.addEventListener("resize", () => {
      checkDrawerButton(controller.canvas, imageSize);
    });

    checkDrawerButton(controller.canvas, imageSize);
  });
}
