import { ICoordinates } from "./coordinates";

export class Board {
  public static parse(text: string): Board {
    let playerId = 1;
    const pieces = text.trim().split("\n").map((x, i) => {
      return x.trim().split(",").map((s, j) => {
        let piece: IPiece = undefined;
        const pieceType = parseInt(s, 10) as PieceType;
        if (pieceType === PieceType.Player) {
          piece = playerPieceGenerator(playerId++, { x: j, y: i });
        } else {
          piece = pieceGenerator(pieceType, { x: j, y: i });
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
    const player = this.getPlayer(playerId);

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
        return this.canClimb(player);
      case Move.GrabDrop:
        return this.canGrabDrop(player);
      default:
        throw new Error(`Unknown move ${move}`);
    }
  }

  private canClimb(player: IPlayerPiece): boolean {
    const pieceToClimb = this.getFacingPiece(player);
    const playerTopPiece = this.getTopPiece(player);
    const pieceToClimbTo = this.getTopPiece(pieceToClimb);
    return pieceToClimb.type !== PieceType.Empty &&
      pieceToClimbTo.type === PieceType.Empty &&
      (playerTopPiece.type === PieceType.Empty ||
        (Boolean(player.blockCoords) && player.blockCoords.x === playerTopPiece.coords.x &&
          player.blockCoords.y === playerTopPiece.coords.y));
  }

  private canGrabDrop(player: IPlayerPiece): boolean {
    // If the player has a block, we must validate dropping it.
    if (player.blockCoords) {
      const facingPiece = this.getFacingPiece(player);
      const topPiece = this.getTopPiece(facingPiece);
      return topPiece.type === PieceType.Empty;
    } else {
      const pieceToPickup = this.getFacingPiece(player);
      const playerTopPieceGrab = this.getTopPiece(player);
      const pieceToPickupTop = this.getTopPiece(pieceToPickup);
      return pieceToPickup.type === PieceType.Block &&
        playerTopPieceGrab.type === PieceType.Empty &&
        pieceToPickupTop.type === PieceType.Empty;
    }
  }

  public move(playerId: number, move: Move): void {
    const player = this.getPlayer(playerId);

    if (!player) {
      return;
    }

    // Always make the player face elsewhere.
    switch (move) {
      case Move.Left:
        player.facingLeft = true;
        break;
      case Move.Right:
        player.facingLeft = false;
        break;
      default:
        break;
    }

    if (!this.canMove(playerId, move)) {
      return;
    }

    switch (move) {
      case Move.Left:
        const leftPiece = this.getLeftPiece(player);
        this.swapPieces(leftPiece, player);
        this.makePlayerFall(player);
        this.makeBlockFollow(player);
        break;

      case Move.Right:
        const rightPiece = this.getRightPiece(player);
        this.swapPieces(rightPiece, player);
        this.makePlayerFall(player);
        this.makeBlockFollow(player);
        break;

      case Move.Climb:
        const facingPiece = this.getFacingPiece(player);
        const topPiece = this.getTopPiece(facingPiece);
        this.swapPieces(topPiece, player);
        this.makeBlockFollow(player);
        break;

      case Move.GrabDrop:
        this.grabDrop(player);
        break;

      default:
        throw new Error(`Unknown move ${move}`);
    }
  }

  private grabDrop(player: IPlayerPiece): void {
    const facingPiece = this.getFacingPiece(player);
    if (player.blockCoords) {
      const blockPiece = this.getPieceByCoordinates(player.blockCoords);
      if (facingPiece.type === PieceType.Empty) {
        this.swapPieces(facingPiece, blockPiece);
      } else {
        const topPieceDrop = this.getTopPiece(facingPiece);
        this.swapPieces(topPieceDrop, blockPiece);
      }

      player.blockCoords = undefined;
    } else {
      const topPieceGrab = this.getTopPiece(player);
      this.swapPieces(facingPiece, topPieceGrab);
      player.blockCoords = facingPiece.coords;
    }
  }

  private getPlayer(playerId: number): IPlayerPiece {
    return this.pieces.filter(
      x => x.type === PieceType.Player &&
        (x as IPlayerPiece).playerId === playerId)[0] as IPlayerPiece;
  }

  private swapPieces(one: IPiece, two: IPiece): void {
    const tmp = one.coords;
    one.coords = two.coords;
    two.coords = tmp;
  }

  private makePlayerFall(player: IPlayerPiece): void {
    let bottomPiece = this.getBottomPiece(player);
    while (bottomPiece.type === PieceType.Empty) {
      this.swapPieces(bottomPiece, player);
      bottomPiece = this.getBottomPiece(player);
    }
  }

  private makeBlockFollow(player: IPlayerPiece): void {
    if (player.blockCoords) {
      const topPiece = this.getTopPiece(player);
      const blockPiece = this.getPieceByCoordinates(player.blockCoords);
      this.swapPieces(topPiece, blockPiece);
      player.blockCoords = blockPiece.coords;
    }
  }

  private getPieceByCoordinates(coords: ICoordinates): IPiece {
    return this.getPiece(coords.x, coords.y);
  }

  private getPiece(x: number, y: number): IPiece {
    return this.pieces.filter(p => p.coords.x === x && p.coords.y === y)[0];
  }

  private getLeftPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.coords.x - 1, piece.coords.y);
  }

  private getRightPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.coords.x + 1, piece.coords.y);
  }

  private getTopPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.coords.x, piece.coords.y - 1);
  }

  private getBottomPiece(piece: IPiece): IPiece {
    return this.getPiece(piece.coords.x, piece.coords.y + 1);
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
    coords
  };
}

export function playerPieceGenerator(id: number, coords: ICoordinates): IPlayerPiece {
  return {
    type: PieceType.Player,
    playerId: id,
    facingLeft: true,
    coords
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
