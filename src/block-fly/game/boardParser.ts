import { Board } from "./board";
import { ITextLevel } from "./level";

export interface IBoardParser {
  parse(input: string | ITextLevel): Board;

  asString(board: Board): string;
}
