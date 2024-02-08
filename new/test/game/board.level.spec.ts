import { expect } from "chai";
import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import {
  Move
} from "../../src/block-fly/game/board";
import { assertBoardEqual } from "./boardHelpers";

const parser = new BoardParser();

describe("!unit! Board level", () => {
  describe("win through door", () => {
    it("triggers win callback on left move", () => {
      const board = parser.parse(`
        #DP#
        ####
      `);

      board.move(1, Move.Left);

      expect(board.hasWon).to.be.true;

      assertBoardEqual(board, parser, `
        #DP#
        ####
      `);
    });

    it("triggers win callback on fall", () => {
      const board = parser.parse(`
        # P#
        #D##
        ####
      `);

      board.move(1, Move.Left);

      expect(board.hasWon).to.be.true;

      assertBoardEqual(board, parser, `
        #P #
        #D##
        ####
      `);
    });

    it("triggers win callback on climb", () => {
      const board = parser.parse(`
        #D #
        ##P#
        ####
      `);

      board.move(1, Move.Climb);

      expect(board.hasWon).to.be.true;

      assertBoardEqual(board, parser, `
        #D #
        ##P#
        ####
      `);
    });
  });
});
