import { getXHRLevels } from "../display/levelControls";
import { ILevelSet } from "../game/level";
import DefaultStorage from "./storage";

export class LevelStorage {
  public static readonly LatestLevelsKey: string = "latestLevels";
  private readonly storage: Storage;

  public constructor(storage?: Storage) {
    this.storage = storage ?? DefaultStorage;
  }

  public async loadlatestLevels(): Promise<IStoredLevel | undefined> {
    const latestLevel: ILatestLevel = JSON.parse(
      this.storage.getItem(LevelStorage.LatestLevelsKey)!
    );

    if (latestLevel && latestLevel.uri) {
      if (latestLevel.uri.indexOf("http") === 0) {
        const levels = await getXHRLevels(latestLevel.uri);
        return { levelSet: levels, password: latestLevel.password };
      } else if (latestLevel.uri.indexOf("file") === 0) {
        const latestLevelFile = this.storage.getItem(latestLevel.uri);
        if (latestLevelFile) {
          const levels = JSON.parse(latestLevelFile) as ILevelSet;
          return { levelSet: levels, password: latestLevel.password };
        } else {
          throw new Error(
            `Don't have ${latestLevel.uri} in local cache, you'll have to reload it!`
          );
        }
      } else {
        throw new Error(`Don't know how to reload levels at ${latestLevel.uri}`);
      }
    }

    return undefined;
  }

  public storeLatestLevels(uri: string, password: string): Promise<void> {
    this.storage.setItem(
      LevelStorage.LatestLevelsKey,
      JSON.stringify({
        uri,
        password,
      } as ILatestLevel)
    );

    return Promise.resolve();
  }
}

export interface IStoredLevel {
  levelSet: ILevelSet;
  password: string;
}

interface ILatestLevel {
  uri: string;
  password: string;
}
