import {
  Board,
  Move
} from "../../src/block-fly/game/board";
import { assertBoardEqual, makePlayerFaceRight, makePlayerHaveBlock } from "./boardHelpers";

describe("!unit! Board move", () => {
  describe("left", () => {
    it("move left changes board", () => {
      const board = Board.parse(`
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);

      board.move(1, Move.Left);

      assertBoardEqual(board, `
        1,0,0,1
        1,3,0,1
        1,1,1,1
      `);
    });

    it("move left make player fall high", () => {
      const board = Board.parse(`
        1,0,3,1
        1,0,1,1
        1,0,1,1
        1,1,1,1
      `);

      board.move(1, Move.Left);

      assertBoardEqual(board, `
        1,0,0,1
        1,0,1,1
        1,3,1,1
        1,1,1,1
      `);
    });

    it("move left with block then follows", () => {
      const board = Board.parse(`
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

      assertBoardEqual(board, `
        1,0,0,0,0,0,1
        1,2,0,0,0,0,1
        1,3,0,0,0,0,1
        1,1,1,1,1,1,1
      `);
    });
  });

  describe("right", () => {
    it("move right changes board", () => {
      const board = Board.parse(`
        1,0,0,1
        1,3,0,1
        1,1,1,1
      `);

      board.move(1, Move.Right);

      assertBoardEqual(board, `
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);
    });

    it("move right makes fly fall", () => {
      const board = Board.parse(`
        1,3,0,1
        1,1,0,1
        1,1,1,1
      `);

      board.move(1, Move.Right);

      assertBoardEqual(board, `
        1,0,0,1
        1,1,3,1
        1,1,1,1
      `);
    });

    it("move right makes fly fall with block", () => {
      const board = Board.parse(`
        1,2,0,1
        1,3,0,1
        1,1,0,1
        1,1,0,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 1, y: 0 });
      board.move(1, Move.Right);

      assertBoardEqual(board, `
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
      const board = Board.parse(`
        1,0,0,1
        1,1,3,1
        1,1,1,1
      `);

      board.move(1, Move.Climb);

      assertBoardEqual(board, `
        1,3,0,1
        1,1,0,1
        1,1,1,1
      `);
    });

    it("move climb to right", () => {
      const board = Board.parse(`
        1,0,0,1
        1,3,1,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      board.move(1, Move.Climb);

      assertBoardEqual(board, `
        1,0,3,1
        1,0,1,1
        1,1,1,1
      `);
    });

    it("move climb to right with block", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,0,1
        1,3,1,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 1, y: 1 });
      makePlayerFaceRight(board);
      board.move(1, Move.Climb);

      assertBoardEqual(board, `
        1,0,2,1
        1,0,3,1
        1,0,1,1
        1,1,1,1
      `);
    });
  });

  describe("grab", () => {
    it("move grab picks up block from left", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, `
        1,0,2,1
        1,0,3,1
        1,1,1,1
      `);
    });

    it("move grab picks up block from right", () => {
      const board = Board.parse(`
        1,0,0,1
        1,3,2,1
        1,1,1,1
      `);

      makePlayerFaceRight(board);
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, `
        1,2,0,1
        1,3,0,1
        1,1,1,1
      `);
    });
  });

  describe("drop", () => {
    it("move drops block facing", () => {
      const board = Board.parse(`
        1,0,2,1
        1,0,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, `
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);
    });

    it("move drops block on top of wall", () => {
      const board = Board.parse(`
        1,0,2,1
        1,1,3,1
        1,1,1,1
      `);

      makePlayerHaveBlock(board, { x: 2, y: 0 });
      board.move(1, Move.GrabDrop);

      assertBoardEqual(board, `
        1,2,0,1
        1,1,3,1
        1,1,1,1
      `);
    });
  });
});
