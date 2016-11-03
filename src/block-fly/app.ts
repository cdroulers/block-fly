import { Board, Move } from "./game/board";
import BoardParser from "./game/symbolsBoardParser";
import { writeToCanvas } from "./display/canvasDisplay";


const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();
const board: Board = parser.parse(`
#                  #
#                  #
#                  #
#   #       #      #
#D  #   # B # B P  #
####################`);

board.onWin.then(() => {
  alert("YOU WIN THIS LEVEL. Give yourself a high-five");
});

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
