import { Board } from "./game/board";
import { writeToCanvas } from "./display/canvasDisplay";


const canvas = document.getElementById("root") as HTMLCanvasElement;

const board = Board.parse(`
      1,4,0,0,1
      1,1,0,0,1
      1,1,2,3,1
      1,1,1,1,1
      `);

writeToCanvas(canvas, board);

