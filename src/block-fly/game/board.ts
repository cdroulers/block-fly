export class Board {
  public static parse(text: string): Board {
    let playerId = 1;
    const pieces = text.trim().split("\n").map((x, i) => {
      return x.trim().split(",").map((s, j) => {
        let piece: IPiece = undefined;
        const pieceType = parseInt(s, 10) as PieceType;
        if (pieceType === PieceType.Player) {
          piece = playerPieceGenerator(playerId++, j, i);
        } else {
          piece = pieceGenerator(pieceType, j, i);
        }

        return piece;
      });
    });

    const arrayOfPieces = [];
    pieces.forEach(x => arrayOfPieces.push(...x));

    return new Board(arrayOfPieces, pieces[0].length, pieces.length);
  }

  public constructor(
    public pieces: IPiece[],
    public width: number,
    public height: number) {
  }

  public canMove(playerId: number, move: Move): boolean {
    const player = this.pieces.filter(
      x => x.type === PieceType.Player &&
        (x as IPlayerPiece).playerId === playerId)[0] as IPlayerPiece;

    if (!player) {
      return false;
    }

    switch (move) {
      case Move.Left:
        const leftPiece = this.getLeftPiece(player);
        return leftPiece.type === PieceType.Empty;
      case Move.Right:
        const rightPiece = this.getRightPiece(player);
        return rightPiece.type === PieceType.Empty;
      case Move.Climb:
        const pieceToClimb = this.getFacingPiece(player);
        const playerTopPiece = this.getTopPiece(player);
        const pieceToClimbTo = this.getTopPiece(pieceToClimb);
        return pieceToClimb.type !== PieceType.Empty &&
          pieceToClimbTo.type === PieceType.Empty &&
          playerTopPiece.type === PieceType.Empty;
      case Move.GrabDrop:
        return undefined;
      default:
        throw new Error(`Unknown move ${move}`);
    }
  }

  public move(playerId: number, move: Move): void {
    if (!this.canMove(playerId, move)) {
      return;
    }

    const player = this.pieces.filter(
      x => x.type === PieceType.Player &&
        (x as IPlayerPiece).playerId === playerId)[0] as IPlayerPiece;

    if (!player) {
      return;
    }


    switch (move) {
      case Move.Left:
        player.facingLeft = true;
        const leftPiece = this.getLeftPiece(player);
        this.swapPieces(leftPiece, player);
        this.makePlayerFall(player);
        break;
      case Move.Right:
        player.facingLeft = false;
        const rightPiece = this.getRightPiece(player);
        this.swapPieces(rightPiece, player);
        this.makePlayerFall(player);
        break;
      default:
        throw new Error(`Unknown move ${move}`);
    }
  }

  private swapPieces(one: IPiece, two: IPiece): void {
    const x = one.x, y = one.y;
    one.x = two.x;
    one.y = two.y;
    two.x = x;
    two.y = y;
  }

  private makePlayerFall(player: IPlayerPiece) {
    let bottomPiece = this.getBottomPiece(player);
    while (bottomPiece.type === PieceType.Empty) {
      this.swapPieces(bottomPiece, player);
      bottomPiece = this.getBottomPiece(player);
    }
  }

  private getPiece(x: number, y: number): IPiece {
    return this.pieces.filter(p => p.x === x && p.y === y)[0];
  }

  private getLeftPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.x - 1, piece.y);
  }

  private getRightPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.x + 1, piece.y);
  }

  private getTopPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.x, piece.y - 1);
  }

  private getBottomPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.x, piece.y + 1);
  }

  private getFacingPiece(player: IPlayerPiece): IPiece {
    return player.facingLeft ? this.getLeftPiece(player) : this.getRightPiece(player);
  }

  public toString(): string {
    let result = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const piece = this.getPiece(x, y);
        result += piece.type + ",";
      }

      result = result.substring(0, result.length - 1) + "\n";
    }

    return result.trim();
  }
}

export interface IPiece {
  type: PieceType;
  x: number;
  y: number;
}

export interface IPlayerPiece extends IPiece {
  playerId: number;
  facingLeft: boolean;
  hasBlock: boolean;
}

export function pieceGenerator(type: PieceType, x: number, y: number): IPiece {
  return {
    type,
    x,
    y
  };
}

export function playerPieceGenerator(id: number, x: number, y: number): IPlayerPiece {
  return {
    type: PieceType.Player,
    playerId: id,
    facingLeft: true,
    hasBlock: false,
    x,
    y
  };
}

export enum Move {
  Left,
  Right,
  Climb,
  GrabDrop
}

export enum PieceType {
  Empty = 0,
  Wall = 1,
  Block = 2,
  Player = 3,
  Door = 4
}
