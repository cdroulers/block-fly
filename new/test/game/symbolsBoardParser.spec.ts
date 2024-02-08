import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import { PieceType, pieceGenerator, playerPieceGenerator } from "../../src/block-fly/game/pieces";
import { assertBoardEqual } from "./boardHelpers";

const parser = new BoardParser();

describe("!unit! SymbolsBoardParser", () => {
  describe("parse", () => {
    it("Parses simple level", () => {
      const board = parser.parse(`
        #D  #
        ##  #
        ##BP#
        #####
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

    it("Parses complex level", () => {
      const board = parser.parse(`
        #D  #
         ##   #
         ##BP  #
         #######
      `);

      expect(board.width).toBe(8);
      expect(board.height).toBe(4);
      expect(board.pieces).toStrictEqual([
        pieceGenerator(PieceType.Wall, { x: 0, y: 0 }),
        pieceGenerator(PieceType.Door, { x: 1, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 2, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 3, y: 0 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 5, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 6, y: 0 }),
        pieceGenerator(PieceType.Empty, { x: 7, y: 0 }),

        pieceGenerator(PieceType.Empty, { x: 0, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 2, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 3, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 4, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 5, y: 1 }),
        pieceGenerator(PieceType.Wall, { x: 6, y: 1 }),
        pieceGenerator(PieceType.Empty, { x: 7, y: 1 }),

        pieceGenerator(PieceType.Empty, { x: 0, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 2, y: 2 }),
        pieceGenerator(PieceType.Block, { x: 3, y: 2 }),
        playerPieceGenerator(1, { x: 4, y: 2 }),
        pieceGenerator(PieceType.Empty, { x: 5, y: 2 }),
        pieceGenerator(PieceType.Empty, { x: 6, y: 2 }),
        pieceGenerator(PieceType.Wall, { x: 7, y: 2 }),

        pieceGenerator(PieceType.Empty, { x: 0, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 1, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 2, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 3, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 4, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 5, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 6, y: 3 }),
        pieceGenerator(PieceType.Wall, { x: 7, y: 3 }),
      ]);
    });
  });

  describe("asString", () => {
    it("Outputs same as input", () => {
      const board = parser.parse(`
        #D  #
        ##  #
        ##BP#
        #####
      `);

      assertBoardEqual(
        board,
        parser,
        `
        #D  #
        ##  #
        ##BP#
        #####`
      );
    });
  });
});
