import { Move } from "../game/board";
import LevelSet from "../game/levelSet";
import { writeToCanvas } from "./canvasDisplay";

export function bindDefaultControls(canvas: HTMLCanvasElement, levelSet: LevelSet): void {
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
      // Do not mess with default shortcuts.
      return;
    }

    switch (e.keyCode) {
      case 37: // Arrow left
        levelSet.currentLevel.move(1, Move.Left);
        break;
      case 38: // Arrow up
        levelSet.currentLevel.move(1, Move.Climb);
        break;
      case 39: // Arrow right
        levelSet.currentLevel.move(1, Move.Right);
        break;
      case 40: // Arrow down
        levelSet.currentLevel.move(1, Move.GrabDrop);
        break;
      case 82: // Letter "r"
        levelSet.currentLevel.reset();
        break;
      default:
        return;
    }

    e.preventDefault();
    writeToCanvas(canvas, levelSet.currentLevel);
  });

  const resetLink = document.getElementById("reset") as HTMLAnchorElement;

  resetLink.addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    levelSet.currentLevel.reset();
    writeToCanvas(canvas, levelSet.currentLevel);
  });
}
