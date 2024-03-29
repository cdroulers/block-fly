import { Board } from "../../src/block-fly/game/board";
import { IBoardParser } from "../../src/block-fly/game/boardParser";
import { PieceType, IPlayerPiece } from "../../src/block-fly/game/pieces";

import { ICoordinates } from "../../src/block-fly/game/coordinates";

export function assertBoardEqual(board: Board, parser: IBoardParser, expected: string): void {
  expected = expected
    .trim()
    .split("\n")
    .map((x) => x.trim())
    .join("\n");

  expect(parser.asString(board)).toBe(expected);
}

export function makePlayerFaceRight(board: Board): void {
  (board.pieces.filter((x) => x.type === PieceType.Player)[0] as IPlayerPiece).facingLeft = false;
}

export function makePlayerHaveBlock(board: Board, coords: ICoordinates): void {
  (board.pieces.filter((x) => x.type === PieceType.Player)[0] as IPlayerPiece).blockCoords = coords;
}
