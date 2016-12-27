import { IPiece } from "./pieces";

export interface ILevel {
  name?: string;

  number: number;

  password?: string;
}

export interface ITextLevel extends ILevel {
  text: string;
}

export interface IPieceLevel extends ILevel {
  pieces: IPiece[];
}
