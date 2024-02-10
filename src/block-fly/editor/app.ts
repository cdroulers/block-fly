import { loadImages, imageSize } from "../display/canvasDisplay";
import { checkDrawerButton } from "../display/helpers";
import Controller from "./controller";

import "material-design-lite/material.min.css";
import "../stylesheets/site.style.scss";
import "./app.style.scss";

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
