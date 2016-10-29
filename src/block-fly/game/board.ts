export class Board {
  public static parse(text: string): Board {
    let playerId = 1;
    const pieces = text.trim().split("\n").map(x => {
      return x.trim().split(",").map(s => {
        let piece: IPiece = undefined;
        const pieceType = parseInt(s, 10) as PieceType;
        if (pieceType === PieceType.Player) {
          piece = playerPieceGenerator(playerId++);
        } else {
          piece = pieceGenerator(pieceType);
        }

        return piece;
      });
    });

    return new Board(pieces);
  }

  public constructor(
    public boardValues: IPiece[][]) {
  }
}

export interface IPiece {
  type: PieceType;
}

export interface IPlayerPiece extends IPiece {
  playerId: number;
  facingLeft: boolean;
}

export function pieceGenerator(type: PieceType): IPiece {
  return {
    type
  };
}

export function playerPieceGenerator(id: number): IPlayerPiece {
  return {
    type: PieceType.Player,
    playerId: id,
    facingLeft: true
  };
}

export enum PieceType {
  Empty = 0,
  Wall = 1,
  Block = 2,
  Player = 3,
  Door = 4
}
