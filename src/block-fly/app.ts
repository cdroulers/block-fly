import { Board, Move } from "./game/board";
import BoardParser from "./game/numbersBoardParser";
import { writeToCanvas } from "./display/canvasDisplay";


const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();
const board: Board = parser.parse(`
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1
1,4,0,0,1,0,0,0,1,0,2,0,1,0,2,0,3,0,0,1
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
      `);

writeToCanvas(canvas, board);

window.onkeydown = (e) => {
  switch (e.keyCode) {
    case 37:
      board.move(1, Move.Left);
      break;
    case 38:
      board.move(1, Move.Climb);
      break;
    case 39:
      board.move(1, Move.Right);
      break;
    case 40:
      board.move(1, Move.GrabDrop);
      break;
    default:
      break;
  }

  writeToCanvas(canvas, board);
};
