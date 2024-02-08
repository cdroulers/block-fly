import { pieceGenerator, playerPieceGenerator, PieceType, IPiece } from "./pieces";
import { IBoardParser } from "./boardParser";
import { Board } from "./board";
import { ITextLevel } from "./level";

export default class SymbolsBoardParser implements IBoardParser {
  private static pieceTypes: { [key: string]: PieceType } = {
    "#": PieceType.Wall,
    " ": PieceType.Empty,
    B: PieceType.Block,
    D: PieceType.Door,
  };

  public parse(input: string | ITextLevel): Board {
    let playerId = 1;

    let text = typeof input === "string" ? input : input.text;

    let lines = text.split("\n").filter((x) => x.trim().length > 0);

    let indices = lines.map((x) => ({ begin: x.indexOf("#"), end: x.lastIndexOf("#") }));
    let stuff = indices.reduce((p, c) => {
      return {
        begin: Math.min(p.begin, c.begin),
        end: Math.max(p.end, c.end),
      };
    });

    let moreLines = lines.map((x) => {
      return (x + "                                         ").substring(
        stuff.begin,
        stuff.end + 1
      );
    });
    const pieces = moreLines.map((x, i) => {
      return x.split("").map((s, j) => {
        if (s === "P") {
          return playerPieceGenerator(playerId++, { x: j, y: i });
        }

        if (typeof SymbolsBoardParser.pieceTypes[s] !== "undefined") {
          return pieceGenerator(SymbolsBoardParser.pieceTypes[s], { x: j, y: i });
        }

        throw new Error(`Unknown piece type '${s}'.`);
      });
    });

    const arrayOfPieces: IPiece[] = [];
    pieces.forEach((x) => arrayOfPieces.push(...x));

    return new Board(
      arrayOfPieces,
      pieces[0].length,
      pieces.length,
      typeof input === "string" ? undefined : input
    );
  }

  public asString(board: Board): string {
    const invertedMap: Record<PieceType, string> = {
      [PieceType.Empty]: "",
      [PieceType.Wall]: "",
      [PieceType.Block]: "",
      [PieceType.Player]: "",
      [PieceType.Door]: "",
    };
    for (const key in SymbolsBoardParser.pieceTypes) {
      if (SymbolsBoardParser.pieceTypes.hasOwnProperty(key)) {
        invertedMap[SymbolsBoardParser.pieceTypes[key]] = key;
      }
    }
    invertedMap[PieceType.Player] = "P";

    let result = "";
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const piece = board.getPiece({ x, y });
        result += invertedMap[piece.type];
      }

      result = result + "\n";
    }

    return result.trim();
  }
}
