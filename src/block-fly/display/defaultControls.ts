import { Move } from "../game/board";
import publisher from "../infrastructure/publisher";
import * as Events from "../infrastructure/events";

let modifiers = { x: 0, y: 0 };

export function bindDefaultControls(): void {
  window.addEventListener("keyup", (e) => {
    // Resets the viewport to the player when shift is released.
    if (!e.shiftKey) {
      modifiers = { x: 0, y: 0 };
      publisher.publish(Events.EventType.ViewportModified, {
        viewport: modifiers,
      } as Events.IViewportModified);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (document.activeElement?.tagName === "INPUT") {
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey) {
      // Do not mess with default shortcuts.
      return;
    }

    // If Shift key is pressed, update viewport modifier to pan canvas.
    if (e.shiftKey) {
      updateModifier(e);
      return;
    }

    switch (e.keyCode) {
      case 37: // Arrow left
        publisher.publish(Events.EventType.PlayerMoved, {
          playerId: 1,
          move: Move.Left,
        } as Events.IPlayerMovedEvent);
        break;
      case 38: // Arrow up
        publisher.publish(Events.EventType.PlayerMoved, {
          playerId: 1,
          move: Move.Climb,
        } as Events.IPlayerMovedEvent);
        break;
      case 39: // Arrow right
        publisher.publish(Events.EventType.PlayerMoved, {
          playerId: 1,
          move: Move.Right,
        } as Events.IPlayerMovedEvent);
        break;
      case 40: // Arrow down
        publisher.publish(Events.EventType.PlayerMoved, {
          playerId: 1,
          move: Move.GrabDrop,
        } as Events.IPlayerMovedEvent);
        break;
      case 82: // Letter "r"
        publisher.publish(Events.EventType.LevelReset, {} as Events.ILevelResetEvent);
        break;
      default:
        return;
    }

    e.preventDefault();
  });

  document.getElementById("reset")!.addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    publisher.publish(Events.EventType.LevelReset, {} as Events.ILevelResetEvent);
  });

  bindMove("left", Move.Left);
  bindMove("up", Move.Climb);
  bindMove("right", Move.Right);
  bindMove("down", Move.GrabDrop);

  const helpDialog = document.getElementById("help-dialog") as HTMLDialogElement;

  document.getElementById("help")!.addEventListener("click", (evt: Event) => {
    evt.preventDefault();

    helpDialog.showModal();
  });
}

function bindMove(id: string, move: Move): void {
  const element = document.getElementById(id)!;

  element.addEventListener("click", (evt: Event) => {
    evt.preventDefault();
    publisher.publish(Events.EventType.PlayerMoved, {
      playerId: 1,
      move,
    } as Events.IPlayerMovedEvent);
  });
}

export function updateModifier(e: KeyboardEvent): void {
  switch (e.keyCode) {
    case 37: // Arrow left
      modifiers = {
        x: modifiers.x - 1,
        y: modifiers.y,
      };
      break;
    case 38: // Arrow up
      modifiers = {
        x: modifiers.x,
        y: modifiers.y - 1,
      };
      break;
    case 39: // Arrow right
      modifiers = {
        x: modifiers.x + 1,
        y: modifiers.y,
      };
      break;
    case 40: // Arrow down
      modifiers = {
        x: modifiers.x,
        y: modifiers.y + 1,
      };
      break;
    default:
      return;
  }

  // TODO: Should constrain modifiers to max viewport size.
  publisher.publish(Events.EventType.ViewportModified, {
    viewport: modifiers,
  } as Events.IViewportModified);
}
