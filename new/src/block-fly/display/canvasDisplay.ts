import { Board } from "../game/board";
import { PieceType, IPlayerPiece } from "../game/pieces";
import { getViewport, ICanvasDimensions, IViewport } from "./viewport";

import player1Left from "../../public/assets/imgs/player1-left.gif";
import player1Right from "../../public/assets/imgs/player1-right.gif";
import empty from "../../public/assets/imgs/empty.gif";
import wall from "../../public/assets/imgs/wall.gif";
import block from "../../public/assets/imgs/block.gif";
import door from "../../public/assets/imgs/door.gif";

export const imageSize = 30;

let images: HTMLImageElement[] = [];

export function loadImages(): Promise<any[]> {
  const promises = [
    loadImage(player1Left),
    loadImage(player1Right),
    loadImage(empty),
    loadImage(wall),
    loadImage(block),
    loadImage(door),
  ];
  return Promise.all(promises).then((values) => {
    images = values;

    return values;
  });
}

export function writeToCanvas(
  canvas: HTMLCanvasElement,
  board: Board,
  viewportModifiers?: IViewport
): void {
  const [player1Left, player1Right, empty, wall, block, door] = images;

  const dimensions = getActualDimensions(board, window);

  const context = canvas.getContext("2d")!;
  canvas.width = dimensions.width * imageSize;
  canvas.height = dimensions.height * imageSize;

  const vp = getViewport(board, dimensions, viewportModifiers);

  for (let y = 0; y < dimensions.height; y++) {
    for (let x = 0; x < dimensions.width; x++) {
      const actualX = x + vp.x;
      const actualY = y + vp.y;
      let piece = board.pieces.filter((p) => p.coords.x === actualX && p.coords.y === actualY)[0];
      switch (piece.type) {
        case PieceType.Block:
          context.drawImage(block, x * imageSize, y * imageSize);
          break;
        case PieceType.Wall:
          context.drawImage(wall, x * imageSize, y * imageSize);
          break;
        case PieceType.Door:
          context.drawImage(door, x * imageSize, y * imageSize);
          break;
        case PieceType.Player:
          context.drawImage(
            (piece as IPlayerPiece).facingLeft ? player1Left : player1Right,
            x * imageSize,
            y * imageSize
          );
          break;
        default:
          context.drawImage(empty, x * imageSize, y * imageSize);
          break;
      }
    }
  }
}

export function getActualDimensions(board: Board, w: Window): ICanvasDimensions {
  return {
    width: Math.min(Math.floor(w.innerWidth / imageSize), board.width),
    height: Math.min(Math.floor(w.innerHeight / imageSize), board.height),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.addEventListener(
      "load",
      () => {
        resolve(img);
      },
      false
    );
    img.src = src;
  });
}
