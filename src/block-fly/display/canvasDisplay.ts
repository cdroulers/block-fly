import { config } from "../../config";
import { Board } from "../game/board";
import { PieceType, IPlayerPiece } from "../game/pieces";
import { getViewport, ICanvasDimensions, IViewport } from "./viewport";

export const imageSize = 30;

let images: HTMLImageElement[] = [];

export function loadImages(): Promise<any[]> {
  const promises = [
    loadImage(config.basePath + "imgs/player1-left.gif"),
    loadImage(config.basePath + "imgs/player1-right.gif"),
    loadImage(config.basePath + "imgs/empty.gif"),
    loadImage(config.basePath + "imgs/wall.gif"),
    loadImage(config.basePath + "imgs/block.gif"),
    loadImage(config.basePath + "imgs/door.gif"),
  ];
  return Promise.all(promises).then((values) => {
    images = values;

    return values;
  });
}

export function writeToCanvas(
  canvas: HTMLCanvasElement,
  board: Board,
  viewportModifiers?: IViewport,
  addGrid?: boolean
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

  if (addGrid) {
    for (let y = 0; y < dimensions.height; y++) {
      context.beginPath();
      const lineY = imageSize + y * imageSize;
      context.moveTo(0, lineY);
      context.lineTo(imageSize * dimensions.width, lineY);
      context.lineWidth = 1;
      context.strokeStyle = "#fff";
      context.stroke();
    }

    for (let x = 0; x < dimensions.width; x++) {
      context.beginPath();
      const lineX = imageSize + x * imageSize;
      context.moveTo(lineX, 0);
      context.lineTo(lineX, imageSize * dimensions.height);
      context.lineWidth = 1;
      context.strokeStyle = "#fff";
      context.stroke();
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
