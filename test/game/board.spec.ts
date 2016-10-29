import { expect } from "chai";
import
{
  Board,
  PieceType,
  pieceGenerator,
  playerPieceGenerator,
  Move,
  IPlayerPiece
} from "../../src/block-fly/game/board";

describe("!unit! Board", () => {
  describe("Parse", () => {
    it("Parses simple level", () => {
      const board = Board.parse(`
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1
      `);

      expect(board.width).to.equal(5);
      expect(board.height).to.equal(4);
      expect(board.pieces).to.deep.equal([
        pieceGenerator(PieceType.Wall, 0, 0),
        pieceGenerator(PieceType.Door, 1, 0),
        pieceGenerator(PieceType.Empty, 2, 0),
        pieceGenerator(PieceType.Empty, 3, 0),
        pieceGenerator(PieceType.Wall, 4, 0),
        pieceGenerator(PieceType.Wall, 0, 1),
        pieceGenerator(PieceType.Wall, 1, 1),
        pieceGenerator(PieceType.Empty, 2, 1),
        pieceGenerator(PieceType.Empty, 3, 1),
        pieceGenerator(PieceType.Wall, 4, 1),
        pieceGenerator(PieceType.Wall, 0, 2),
        pieceGenerator(PieceType.Wall, 1, 2),
        pieceGenerator(PieceType.Block, 2, 2),
        playerPieceGenerator(1, 3, 2),
        pieceGenerator(PieceType.Wall, 4, 2),
        pieceGenerator(PieceType.Wall, 0, 3),
        pieceGenerator(PieceType.Wall, 1, 3),
        pieceGenerator(PieceType.Wall, 2, 3),
        pieceGenerator(PieceType.Wall, 3, 3),
        pieceGenerator(PieceType.Wall, 4, 3)
      ]);
    });
  });

  function assertBoardEqual(board: Board, expected: string): void {
    expected = expected.trim().split("\n").map(x => x.trim()).join("\n");

    expect(board.toString()).to.equal(expected);
  }

  describe("toString", () => {
    it("Outputs same as input", () => {
      const board = Board.parse(`
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1
      `);

      assertBoardEqual(board, `
        1,4,0,0,1
        1,1,0,0,1
        1,1,2,3,1
        1,1,1,1,1`
      );
    });
  });

  describe("canMove", () => {
    it("can't move left because of block", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Left);
      expect(actual).to.be.false;
    });

    it("can't move right because of wall", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Right);
      expect(actual).to.be.false;
    });

    it("can climb left", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.true;
    });

    it("can't climb left because of empty", () => {
      const board = Board.parse(`
        1,0,0,1
        1,0,3,1
        1,1,1,1
      `);

      const actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.false;
    });

    it("can't climb left or right because of wall over", () => {
      const board = Board.parse(`
        1,0,1,0,1
        1,2,3,1,1
        1,1,1,1,1
      `);

      let actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.false;

      (board.pieces.filter(x => x.type === PieceType.Player)[0] as IPlayerPiece).facingLeft = false;
      actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.false;
    });

    it("can climb right", () => {
      const board = Board.parse(`
        1,0,0,1
        1,3,2,1
        1,1,1,1
      `);

      (board.pieces.filter(x => x.type === PieceType.Player)[0] as IPlayerPiece).facingLeft = false;
      const actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.true;
    });

    it("can't climb right", () => {
      const board = Board.parse(`
        1,0,0,1
        1,2,3,1
        1,1,1,1
      `);

      (board.pieces.filter(x => x.type === PieceType.Player)[0] as IPlayerPiece).facingLeft = false;
      const actual = board.canMove(1, Move.Climb);
      expect(actual).to.be.false;
    });
  });

  describe("move", () => {
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
  });
});
