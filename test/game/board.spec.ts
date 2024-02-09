import BoardParser from "../../src/block-fly/game/numbersBoardParser";
import SymbolsBoardParser from "../../src/block-fly/game/symbolsBoardParser";
import { Move } from "../../src/block-fly/game/board";
import { PieceType, pieceGenerator, playerPieceGenerator } from "../../src/block-fly/game/pieces";
import { assertBoardEqual } from "./boardHelpers";

const parser = new BoardParser();
const symbolsParser = new SymbolsBoardParser();

describe("!unit! Board", () => {
  describe("Parse", () => {
    it("Parses simple level", () => {
      const board = parser.parse(`
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1
      `);

      expect(board.width).toBe(5);
      expect(board.height).toBe(4);
      expect(board.pieces).toStrictEqual([
        pieceGenerator(PieceType.Wall, { x: 0, y: 0 }),
        pieceGenerator(PieceType.Door, { x: 1, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 2, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 3, y: 0 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 0 }),
        pieceGenerator(PieceType.Wall, { x: 0, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 2, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 3, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 0, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 2 }),
        pieceGenerator(PieceType.Block, { x: 2, y: 2 }),
        playerPieceGenerator(1, { x: 3, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 0, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 2, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 3, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 3 }),
      ]);
    });
  });

  describe("toString", () => {
    it("Outputs same as input", () => {
      const board = parser.parse(`
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1
      `);

      assertBoardEqual(
        board,
        parser,
        `
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1`
      );
    });
  });

  describe("reset", () => {
    it("puts board back to same state after moves", () => {
      const board = symbolsParser.parse(`
        #D  P#
        ######
      `);

      board.move(1, Move.Left);
      board.move(1, Move.Left);

      board.reset();

      assertBoardEqual(
        board,
        symbolsParser,
        `
        #D  P#
        ######
      `
      );
    });
  });
});
