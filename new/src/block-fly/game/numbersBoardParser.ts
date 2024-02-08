import { IPiece, pieceGenerator, playerPieceGenerator, PieceType } from "./pieces";
import { IBoardParser } from "./boardParser";
import { Board } from "./board";
import { ITextLevel } from "./level";

export default class NumbersBoardParser implements IBoardParser {
  public parse(text: string | ITextLevel): Board {
    if (typeof text !== "string") {
      throw new Error("This parser doesn't support ITextLevel");
    }

    let playerId = 1;
    const pieces = text
      .trim()
      .split("\n")
      .map((x, i) => {
        return x
          .trim()
          .split(",")
          .map((s, j) => {
            let piece: IPiece = undefined;
            const pieceType = parseInt(s, 10) as PieceType;
            if (pieceType === PieceType.Player) {
              piece = playerPieceGenerator(playerId++, { x: j, y: i });
            } else {
              piece = pieceGenerator(pieceType, { x: j, y: i });
            }

            return piece;
          });
      });

    const arrayOfPieces = [];
    pieces.forEach((x) => arrayOfPieces.push(...x));

    return new Board(arrayOfPieces, pieces[0].length, pieces.length);
  }

  public asString(board: Board): string {
    let result = "";
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const piece = board.getPiece({ x, y });
        result += piece.type + ",";
      }

      result = result.substring(0, result.length - 1) + "\n";
    }

    return result.trim();
  }
}
