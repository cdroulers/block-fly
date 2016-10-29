import { expect } from "chai";
import { Board, PieceType, pieceGenerator, playerPieceGenerator } from "../../src/block-fly/game/board";

describe("!unit! Board", () => {
  describe("Parse", () => {
    it("Parses simple level", () => {
      const board = Board.parse(`
      1,4,0,0,1
      1,1,0,0,1
      1,1,2,3,1
      1,1,1,1,1
      `);

      expect(board.boardValues).to.deep.equal([
        [
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Door),
          pieceGenerator(PieceType.Empty),
          pieceGenerator(PieceType.Empty),
          pieceGenerator(PieceType.Wall)
        ],
        [
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Empty),
          pieceGenerator(PieceType.Empty),
          pieceGenerator(PieceType.Wall)
        ],
        [
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Block),
          playerPieceGenerator(1),
          pieceGenerator(PieceType.Wall)
        ],
        [
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall),
          pieceGenerator(PieceType.Wall)
        ]
      ]);
    });
  });
});
