import { Move } from "../game/board";
import LevelSet from "../game/levelSet";
import { writeToCanvas } from "./canvasDisplay";

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
  }

  function handleTouchEnd(evt: TouchEvent): void {
    const hasCoords = Boolean(xDown) && Boolean(yDown);
    if (!hasCoords) {
      return;
    }

    let xUp = evt.changedTouches[0].clientX;
    let yUp = evt.changedTouches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        levelSet.currentLevel.move(1, Move.Left);
      } else {
        levelSet.currentLevel.move(1, Move.Right);
      }
    } else {
      if (yDiff > 0) {
        levelSet.currentLevel.move(1, Move.Climb);
      } else {
        levelSet.currentLevel.move(1, Move.GrabDrop);
      }
    }

    writeToCanvas(canvas, levelSet.currentLevel);

    xDown = undefined;
    yDown = undefined;
  }
}
