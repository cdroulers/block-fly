import { expect } from "chai";
import {
  Board,
  PieceType,
  IPlayerPiece
} from "../../src/block-fly/game/board";

import { ICoordinates } from "../../src/block-fly/game/coordinates";

export function assertBoardEqual(board: Board, expected: string): void {
  expected = expected.trim().split("\n").map(x => x.trim()).join("\n");

  expect(board.toString()).to.equal(expected);
}

export function makePlayerFaceRight(board: Board): void {
  (board.pieces.filter(x => x.type === PieceType.Player)[0] as IPlayerPiece).facingLeft = false;
}

export function makePlayerHaveBlock(board: Board, coords: ICoordinates): void {
  (board.pieces.filter(x => x.type === PieceType.Player)[0] as IPlayerPiece).blockCoords = coords;
}
