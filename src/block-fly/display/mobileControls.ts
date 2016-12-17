import LevelSet from "../game/levelSet";
import { writeToCanvas, imageSize } from "./canvasDisplay";

export function bindMobileControls(canvas: HTMLCanvasElement, levelSet: LevelSet): void {
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

    let xModifier = Math.floor((xDragged - xDown) / imageSize);
    let yModifier = Math.floor((yDown - yDragged) / imageSize);
    writeToCanvas(canvas, levelSet.currentLevel, { x: xModifier, y: yModifier });
  }

  function handleTouchEnd(evt: TouchEvent): void {
    writeToCanvas(canvas, levelSet.currentLevel);
  }
}
