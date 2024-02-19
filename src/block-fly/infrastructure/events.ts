import { Move } from "../game/board";
import { ILevelSet } from "../game/level";
import { IViewport } from "../display/viewport";

export enum EventType {
  PlayerMoved,
  ViewportModified,
  LevelReset,
  WentToLevelWithPassword,
  LevelsLoaded,
}

export interface IPlayerMovedEvent {
  playerId: number;
  move: Move;
}

export interface IViewportModified {
  viewport: IViewport;
}

export interface ILevelResetEvent {}

export interface IWentToLevelWithPasswordEvent {
  password: string;
}

export interface ILevelsLoadedEvent {
  levelSet: ILevelSet;
  password?: string;
}
