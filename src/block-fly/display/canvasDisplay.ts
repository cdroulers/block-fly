import { Board, PieceType } from "../game/board";
import * as Promise from "bluebird";

const imageSize = 30;

export function writeToCanvas(canvas: HTMLCanvasElement, board: Board): void {
  const promises = [
    loadImage("/assets/imgs/player1-left.gif"),
    loadImage("/assets/imgs/empty.gif"),
    loadImage("/assets/imgs/wall.gif"),
    loadImage("/assets/imgs/block.gif"),
    loadImage("/assets/imgs/door.gif")
  ];
  Promise.all(promises).then(values => {
    let [player1Left, empty, wall, block, door] = values;

    const context = canvas.getContext("2d");

    for (let y = 0; y < board.boardValues.length; y++) {
      const row = board.boardValues[y];
      for (let x = 0; x < row.length; x++) {
        let piece = row[x];
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
            context.drawImage(player1Left, x * imageSize, y * imageSize);
            break;
          default:
            context.drawImage(empty, x * imageSize, y * imageSize);
            break;
        }
      }
    }
  })
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
  })
}
