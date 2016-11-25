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

  document.getElementById("reset").addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    levelSet.currentLevel.reset();
    writeToCanvas(canvas, levelSet.currentLevel);
  });

  bindMove("left", Move.Left, canvas, levelSet);
  bindMove("up", Move.Climb, canvas, levelSet);
  bindMove("right", Move.Right, canvas, levelSet);
  bindMove("down", Move.GrabDrop, canvas, levelSet);
}

function bindMove(id: string, move: Move, canvas: HTMLCanvasElement, levelSet: LevelSet): void {
  const element = document.getElementById(id);

  element.addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    levelSet.currentLevel.move(1, move);
    writeToCanvas(canvas, levelSet.currentLevel);
  });
}
