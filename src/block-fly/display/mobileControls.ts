import publisher from "../infrastructure/publisher";
import * as Events from "../infrastructure/events";
import { imageSize } from "./canvasDisplay";

export function bindMobileControls(canvas: HTMLCanvasElement): void {
  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);

  let xDown = undefined;
  let yDown = undefined;

  function handleTouchStart(evt: TouchEvent): void {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  }

  function handleTouchMove(evt: TouchEvent): void {
    evt.preventDefault();
    let xDragged = evt.changedTouches[0].clientX;
    let yDragged = evt.changedTouches[0].clientY;

    let xModifier = Math.floor((xDragged - xDown) / imageSize * 5.0);
    let yModifier = Math.floor((yDown - yDragged) / imageSize * 5.0);
    publisher.publish(Events.EventType.ViewportModified, { x: xModifier, y: yModifier });
  }

  function handleTouchEnd(evt: TouchEvent): void {
    publisher.publish(Events.EventType.ViewportModified, { x: 0, y: 0 });
  }
}
