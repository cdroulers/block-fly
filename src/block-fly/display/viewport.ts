import { Board } from "../game/board";
import { PieceType } from "../game/pieces";

export interface ICanvasDimensions {
  width: number;
  height: number;
}

export interface IViewport {
  x: number;
  y: number;
}

export function getViewport(
  board: Board,
  canvasDimensions: ICanvasDimensions,
  modifiers?: IViewport
): IViewport {
  const player = board.pieces.filter((x) => x.type === PieceType.Player)[0];

  const width = Math.floor(canvasDimensions.width / 2);
  const height = Math.floor(canvasDimensions.height / 2);
  let result = constrain(board, canvasDimensions, {
    x: player.coords.x - width,
    y: player.coords.y - height,
  });

  if (modifiers) {
    result = constrain(board, canvasDimensions, {
      x: result.x + modifiers.x,
      y: result.y + modifiers.y,
    });
  }

  return result;
}

function constrain(
  board: Board,
  canvasDimensions: ICanvasDimensions,
  viewport: IViewport
): IViewport {
  return {
    x: Math.max(Math.min(board.width - canvasDimensions.width, viewport.x), 0),
    y: Math.max(Math.min(board.height - canvasDimensions.height, viewport.y), 0),
  };
}
