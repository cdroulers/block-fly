import { Move } from "../../src/block-fly/game/board";
import BoardParser from "../../src/block-fly/game/numbersBoardParser";
import SymbolsBoardParser from "../../src/block-fly/game/symbolsBoardParser";
import { makePlayerFaceRight, makePlayerHaveBlock } from "./boardHelpers";

const parser = new BoardParser();
const symbolsParser = new SymbolsBoardParser();

describe("!unit! Board canMove", () => {
  describe("left", () => {
    it("can't move left because of block", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Left);
      expect(actual).toBeFalsy();
    });

    it("can move left to empty", () => {
      const board = symbolsParser.parse(`
        #  #
        # P#
        ####
      `);

      const actual = board.canMove(1, Move.Left);
      expect(actual).toBeTruthy();
    });

    it("can move left to door", () => {
      const board = symbolsParser.parse(`
        #  #
        #DP#
        ####
      `);

      const actual = board.canMove(1, Move.Left);
      expect(actual).toBeTruthy();
    });

    it("can't go left with block on head with wall in way", () => {
      const board = symbolsParser.parse(`
        ##B#
        # P#
        ####
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.Left);
      expect(actual).toBeFalsy();
    });
  });

  describe("right", () => {
    it("can't move right because of wall", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Right);
      expect(actual).toBeFalsy();
    });

    it("can move right to empty", () => {
      const board = symbolsParser.parse(`
        #  #
        #P #
        ####
      `);

      const actual = board.canMove(1, Move.Right);
      expect(actual).toBeTruthy();
    });

    it("can move right to door", () => {
      const board = symbolsParser.parse(`
        #  #
        #PD#
        ####
      `);

      const actual = board.canMove(1, Move.Right);
      expect(actual).toBeTruthy();
    });

    it("can't go right with block on head with wall in way", () => {
      const board = symbolsParser.parse(`
        #B##
        #P #
        ####
      `);

      makePlayerHaveBlock(board, { x: 1, y: 0 });
      const actual = board.canMove(1, Move.Right);
      expect(actual).toBeFalsy();
    });
  });

  describe("climb", () => {
    it("can climb left", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeTruthy();
    });

    it("can't climb left because of empty", () => {
      const board = parser.parse(`
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();
    });

    it("can't climb left or right because of wall over", () => {
      const board = parser.parse(`
        1,0,1,0,1
        1,2,3,1,1
        1,1,1,1,1
      `);

      let actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();

      makePlayerFaceRight(board);
      actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();
    });

    it("can't climb left or right with block because of wall over destination", () => {
      const board = symbolsParser.parse(`
        ## ##
        # B #
        ##P##
        #####
      `);

      makePlayerHaveBlock(board, { x: 2, y: 1 });
      let actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();

      makePlayerFaceRight(board);
      actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();
    });

    it("can't climb left or right with block because of wall over block", () => {
      const board = symbolsParser.parse(`
        # # #
        # B #
        ##P##
        #####
      `);

      makePlayerHaveBlock(board, { x: 2, y: 1 });
      let actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();

      makePlayerFaceRight(board);
      actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();
    });

    it("can climb right", () => {
      const board = parser.parse(`
        1,0,0,1
        1,3,2,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeTruthy();
    });

    it("can't climb right", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeFalsy();
    });

    it("can climb left with block", () => {
      const board = parser.parse(`
        1,0,0,1
        1,0,2,1
        1,1,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 1 });
      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeTruthy();
    });

    it("can climb left to door", () => {
      const board = symbolsParser.parse(`
        #D #
        #BP#
        ####
      `);

      const actual = board.canMove(1, Move.Climb);
      expect(actual).toBeTruthy();
    });
  });

  describe("grab", () => {
    it("can grab left", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeTruthy();
    });

    it("can grab left if something on top of block", () => {
      const board = parser.parse(`
        1,1,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeFalsy();
    });

    it("can grab left if something on top of player", () => {
      const board = parser.parse(`
        1,0,1,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeFalsy();
    });
  });

  describe("drop", () => {
    it("can drop left", () => {
      const board = parser.parse(`
        1,0,2,1
        1,0,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeTruthy();
    });

    it("can drop left over wall", () => {
      const board = parser.parse(`
        1,0,2,1
        1,1,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeTruthy();
    });

    it("can drop left because of wall", () => {
      const board = parser.parse(`
        1,1,2,1
        1,0,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeFalsy();
    });

    it("can drop right", () => {
      const board = parser.parse(`
        1,2,0,1
        1,3,0,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeTruthy();
    });

    it("can drop right over wall", () => {
      const board = parser.parse(`
        1,2,0,1
        1,3,1,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeTruthy();
    });

    it("can't drop right because of wall", () => {
      const board = parser.parse(`
        1,2,1,1
        1,3,0,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      makePlayerHaveBlock(board, { x: 2, y: 0 });
      const actual = board.canMove(1, Move.GrabDrop);
      expect(actual).toBeFalsy();
    });
  });
});
