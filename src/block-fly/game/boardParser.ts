import { Board } from "./board";

export interface IBoardParser {
  parse(text: string): Board;

  asString(board: Board): string;
}
