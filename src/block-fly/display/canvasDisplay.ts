import { Board, Move } from "../game/board";
import LevelSet from "../game/levelSet";
import { PieceType, IPlayerPiece } from "../game/pieces";
import * as Promise from "bluebird";

const imageSize = 30;

export function writeToCanvas(canvas: HTMLCanvasElement, board: Board): void {
  const promises = [
    loadImage("assets/imgs/player1-left.gif"),
    loadImage("assets/imgs/player1-right.gif"),
    loadImage("assets/imgs/empty.gif"),
    loadImage("assets/imgs/wall.gif"),
    loadImage("assets/imgs/block.gif"),
    loadImage("assets/imgs/door.gif")
  ];
  Promise.all(promises).then(values => {
    let [player1Left, player1Right, empty, wall, block, door] = values;

    const context = canvas.getContext("2d");
    canvas.width = board.width * imageSize;
    canvas.height = board.height * imageSize;

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        let piece = board.pieces.filter(p => p.coords.x === x && p.coords.y === y)[0];
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
              y * imageSize);
            break;
          default:
            context.drawImage(empty, x * imageSize, y * imageSize);
            break;
        }
      }
    }
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.addEventListener(
      "load",
      () => {
        resolve(img);
      },
      false);
    img.src = src;
  });
}
