import { expect } from "chai";
import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import {
  Move
} from "../../src/block-fly/game/board";
import { assertBoardEqual } from "./boardHelpers";

const parser = new BoardParser();

describe("!unit! Board level", () => {
  describe("win through door", () => {
    it("triggers win promise on left move", () => {
      const board = parser.parse(`
        #DP#
        ####
      `);

      board.move(1, Move.Left);

      (expect(board.onWin).to as any).eventually.be.fulfilled;

      assertBoardEqual(board, parser, `
        #DP#
        ####
      `);
    });

    it("triggers win promise on fall", () => {
      const board = parser.parse(`
        # P#
        #D##
        ####
      `);

      board.move(1, Move.Left);

      (expect(board.onWin).to as any).eventually.be.fulfilled;

      assertBoardEqual(board, parser, `
        #P #
        #D##
        ####
      `);
    });
  });
});
