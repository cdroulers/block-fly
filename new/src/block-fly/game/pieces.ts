import { ICoordinates } from "./coordinates";

export interface IPiece {
  type: PieceType;
  coords: ICoordinates;
}

export interface IPlayerPiece extends IPiece {
  playerId: number;
  facingLeft: boolean;
  blockCoords?: ICoordinates;
}

export function pieceGenerator(type: PieceType, coords: ICoordinates): IPiece {
  return {
    type,
    coords,
  };
}

export function playerPieceGenerator(id: number, coords: ICoordinates): IPlayerPiece {
  return {
    type: PieceType.Player,
    playerId: id,
    facingLeft: true,
    coords,
  };
}

export enum PieceType {
  Empty = 0,
  Wall = 1,
  Block = 2,
  Player = 3,
  Door = 4,
}
