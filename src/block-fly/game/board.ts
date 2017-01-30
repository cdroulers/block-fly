import { ICoordinates } from "./coordinates";
import { ILevel } from "./level";
import {
  IPiece,
  IPlayerPiece,
  PieceType
} from "./pieces";

export class Board {
  private originalState: string;

  private won: boolean = false;

  public onWin: () => void;

  public get hasWon(): boolean {
    return this.won;
  }

  public get name(): string {
    return this.level.name || "";
  }

  public get number(): number {
    return this.level.number;
  }

  public get password(): string {
    return this.level.password || "";
  }

  public constructor(
    public pieces: IPiece[],
    public width: number,
    public height: number,
    private level: ILevel = undefined
  ) {
    this.originalState = JSON.stringify(pieces);

    this.level = level || {
      name: "",
      number: 0,
      password: ""
    };
  }

  public canMove(playerId: number, move: Move): boolean {
    if (this.won) {
      return false;
    }

    const player = this.getPlayer(playerId);

    if (!player) {
      return false;
    }

    switch (move) {
      case Move.Left:
        return this.canMoveLeft(player);
      case Move.Right:
        return this.canMoveRight(player);
      case Move.Climb:
        return this.canClimb(player);
      case Move.GrabDrop:
        return this.canGrabDrop(player);
      default:
        throw new Error(`Unknown move ${move}`);
    }
  }

  public move(playerId: number, move: Move): void {
    if (this.won) {
      return;
    }

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
        this.makePieceFall(player);
        this.makeBlockFollow(player);
        break;

      case Move.Right:
        const rightPiece = this.getRightPiece(player);
        this.swapPieces(rightPiece, player);
        this.makePieceFall(player);
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

  public reset(): void {
    this.pieces = JSON.parse(this.originalState);
  }

  public getPiece(coords: ICoordinates): IPiece {
    return this.pieces.filter(p => p.coords.x === coords.x && p.coords.y === coords.y)[0];
  }

  private canMoveLeft(player: IPlayerPiece): boolean {
    const leftPiece = this.getLeftPiece(player);
    const blockPiece = Boolean(player.blockCoords) ? this.getLeftPiece(this.getPiece(player.blockCoords)) : undefined;
    return (leftPiece.type === PieceType.Empty || leftPiece.type === PieceType.Door) &&
      (!Boolean(blockPiece) || blockPiece.type === PieceType.Empty);
  }

  private canMoveRight(player: IPlayerPiece): boolean {
    const rightPiece = this.getRightPiece(player);
    const blockPiece = Boolean(player.blockCoords) ? this.getRightPiece(this.getPiece(player.blockCoords)) : undefined;
    return (rightPiece.type === PieceType.Empty || rightPiece.type === PieceType.Door) &&
      (!Boolean(blockPiece) || blockPiece.type === PieceType.Empty);
  }

  private canClimb(player: IPlayerPiece): boolean {
    const pieceToClimb = this.getFacingPiece(player);
    const playerTopPiece = this.getTopPiece(player);
    const pieceToClimbTo = this.getTopPiece(pieceToClimb);
    const blockPiece = Boolean(player.blockCoords) ? this.getTopPiece(pieceToClimbTo) : undefined;
    return pieceToClimb.type !== PieceType.Empty &&
      (pieceToClimbTo.type === PieceType.Empty || pieceToClimbTo.type === PieceType.Door) &&
      (playerTopPiece.type === PieceType.Empty ||
        (Boolean(player.blockCoords) && player.blockCoords.x === playerTopPiece.coords.x &&
          player.blockCoords.y === playerTopPiece.coords.y)) &&
      (!Boolean(blockPiece) || blockPiece.type === PieceType.Empty);
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

  private grabDrop(player: IPlayerPiece): void {
    const facingPiece = this.getFacingPiece(player);
    if (player.blockCoords) {
      const blockPiece = this.getPiece(player.blockCoords);
      if (facingPiece.type === PieceType.Empty) {
        this.swapPieces(facingPiece, blockPiece);
        this.makePieceFall(blockPiece);
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
    if ((one.type === PieceType.Door && two.type === PieceType.Player) ||
      (two.type === PieceType.Door && one.type === PieceType.Player)) {
      this.triggerWin();
      return;
    }

    const tmp = one.coords;
    one.coords = two.coords;
    two.coords = tmp;
  }

  private triggerWin(): void {
    if (this.onWin) {
      this.onWin();
    }

    this.won = true;
  }

  private makePieceFall(player: IPiece): void {
    let bottomPiece = this.getBottomPiece(player);
    while (bottomPiece.type === PieceType.Empty ||
      bottomPiece.type === PieceType.Door) {
      if (bottomPiece.type === PieceType.Door) {
        this.triggerWin();
        return;
      }

      this.swapPieces(bottomPiece, player);
      bottomPiece = this.getBottomPiece(player);
    }
  }

  private makeBlockFollow(player: IPlayerPiece): void {
    if (player.blockCoords) {
      const topPiece = this.getTopPiece(player);
      const blockPiece = this.getPiece(player.blockCoords);
      this.swapPieces(topPiece, blockPiece);
      player.blockCoords = blockPiece.coords;
    }
  }

  private getLeftPiece(piece: IPiece): IPiece {
    return this.getPiece({ x: piece.coords.x - 1, y: piece.coords.y });
  }

  private getRightPiece(piece: IPiece): IPiece {
    return this.getPiece({ x: piece.coords.x + 1, y: piece.coords.y });
  }

  private getTopPiece(piece: IPiece): IPiece {
    return this.getPiece({ x: piece.coords.x, y: piece.coords.y - 1 });
  }

  private getBottomPiece(piece: IPiece): IPiece {
    return this.getPiece({ x: piece.coords.x, y: piece.coords.y + 1 });
  }

  private getFacingPiece(player: IPlayerPiece): IPiece {
    return player.facingLeft ? this.getLeftPiece(player) : this.getRightPiece(player);
  }
}

export enum Move {
  Left,
  Right,
  Climb,
  GrabDrop
}
