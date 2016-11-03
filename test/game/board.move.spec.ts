import {
  Move
} from "../../src/block-fly/game/board";
import BoardParser from "../../src/block-fly/game/numbersBoardParser";
import { assertBoardEqual, makePlayerFaceRight, makePlayerHaveBlock } from "./boardHelpers";

const parser = new BoardParser();

describe("!unit! Board move", () => {
  describe("left", () => {
    it("move left changes board", () => {
      const board = parser.parse(`
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);

      board.move(1, Move.Left);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,3,0,1
        1,1,1,1
      `);
    });

    it("move left make player fall high", () => {
      const board = parser.parse(`
        1,0,3,1
        1,0,1,1
        1,0,1,1
        1,1,1,1
      `);

      board.move(1, Move.Left);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,0,1,1
        1,3,1,1
        1,1,1,1
      `);
    });

    it("move left with block then follows", () => {
      const board = parser.parse(`
        1,0,0,0,0,0,1
        1,0,0,0,0,0,1
        1,0,0,0,2,3,1
        1,1,1,1,1,1,1
      `);

      board.move(1, Move.GrabDrop);
      board.move(1, Move.Left);
      board.move(1, Move.Left);
      board.move(1, Move.Left);
      board.move(1, Move.Left);

      assertBoardEqual(board, parser, `
        1,0,0,0,0,0,1
        1,2,0,0,0,0,1
        1,3,0,0,0,0,1
        1,1,1,1,1,1,1
      `);
    });
  });

  describe("right", () => {
    it("move right changes board", () => {
      const board = parser.parse(`
        1,0,0,1
        1,3,0,1
        1,1,1,1
      `);

      board.move(1, Move.Right);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);
    });

    it("move right makes fly fall", () => {
      const board = parser.parse(`
        1,3,0,1
        1,1,0,1
        1,1,1,1
      `);

      board.move(1, Move.Right);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,1,3,1
        1,1,1,1
      `);
    });

    it("move right makes fly fall with block", () => {
      const board = parser.parse(`
        1,2,0,1
        1,3,0,1
        1,1,0,1
        1,1,0,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 1, y: 0 });
      board.move(1, Move.Right);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,0,0,1
        1,1,2,1
        1,1,3,1
        1,1,1,1
      `);
    });
  });

  describe("climb", () => {
    it("move climb to left", () => {
      const board = parser.parse(`
        1,0,0,1
        1,1,3,1
        1,1,1,1
      `);

      board.move(1, Move.Climb);

      assertBoardEqual(board, parser, `
        1,3,0,1
        1,1,0,1
        1,1,1,1
      `);
    });

    it("move climb to right", () => {
      const board = parser.parse(`
        1,0,0,1
        1,3,1,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      board.move(1, Move.Climb);

      assertBoardEqual(board, parser, `
        1,0,3,1
        1,0,1,1
        1,1,1,1
      `);
    });

    it("move climb to right with block", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,0,1
        1,3,1,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 1, y: 1 });
      makePlayerFaceRight(board);
      board.move(1, Move.Climb);

      assertBoardEqual(board, parser, `
        1,0,2,1
        1,0,3,1
        1,0,1,1
        1,1,1,1
      `);
    });
  });

  describe("grab", () => {
    it("move grab picks up block from left", () => {
      const board = parser.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, parser, `
        1,0,2,1
        1,0,3,1
        1,1,1,1
      `);
    });

    it("move grab picks up block from right", () => {
      const board = parser.parse(`
        1,0,0,1
        1,3,2,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, parser, `
        1,2,0,1
        1,3,0,1
        1,1,1,1
      `);
    });
  });

  describe("drop", () => {
    it("move drops block facing", () => {
      const board = parser.parse(`
        1,0,2,1
        1,0,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, parser, `
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);
    });

    it("move drops block on top of wall", () => {
      const board = parser.parse(`
        1,0,2,1
        1,1,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, parser, `
        1,2,0,1
        1,1,3,1
        1,1,1,1
      `);
    });
  });
});
