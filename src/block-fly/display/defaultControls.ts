import { Move } from "../game/board";
import LevelSet from "../game/levelSet";
import { writeToCanvas, getActualDimensions } from "./canvasDisplay";
import { getViewport } from "./viewport";

let modifiers = { x: 0, y: 0 };

export function bindDefaultControls(canvas: HTMLCanvasElement, levelSet: LevelSet): void {
  window.addEventListener("resize", (e) => {
    writeToCanvas(canvas, levelSet.currentLevel, modifiers);
  });

  window.addEventListener("keyup", (e) => {
    if (!e.shiftKey) {
      modifiers = { x: 0, y: 0 };
      writeToCanvas(canvas, levelSet.currentLevel, modifiers);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      // Do not mess with default shortcuts.
      return;
    }

    if (e.shiftKey) {
      updateModifier(e, canvas, levelSet);
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
    writeToCanvas(canvas, levelSet.currentLevel, modifiers);
  });

  document.getElementById("reset").addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    levelSet.currentLevel.reset();
    writeToCanvas(canvas, levelSet.currentLevel, modifiers);
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
    writeToCanvas(canvas, levelSet.currentLevel, modifiers);
  });
}

function updateModifier(e: KeyboardEvent, canvas: HTMLCanvasElement, levelSet: LevelSet): void {
  const vpBefore = getViewport(
    levelSet.currentLevel,
    getActualDimensions(levelSet.currentLevel, window),
    modifiers);

  let newModifier = { x: 0, y : 0 };
  switch (e.keyCode) {
    case 37: // Arrow left
      newModifier = {
        x: modifiers.x - 1,
        y: modifiers.y
      };
      break;
    case 38: // Arrow up
      newModifier = {
        x: modifiers.x,
        y: modifiers.y - 1
      };
      break;
    case 39: // Arrow right
      newModifier = {
        x: modifiers.x + 1,
        y: modifiers.y
      };
      break;
    case 40: // Arrow down
      newModifier = {
        x: modifiers.x,
        y: modifiers.y + 1
      };
      break;
    default:
      return;
  }

  const vpAfter = getViewport(
    levelSet.currentLevel,
    getActualDimensions(levelSet.currentLevel, window),
    newModifier);

  if (vpBefore.x === vpAfter.x && vpBefore.y === vpAfter.y) {
    return;
  }

  modifiers = newModifier;
  writeToCanvas(canvas, levelSet.currentLevel, modifiers);
}
