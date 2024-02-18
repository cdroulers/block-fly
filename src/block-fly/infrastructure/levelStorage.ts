import { getRemoteLevels } from "../display/levelControls";
import { ILevelSet } from "../game/level";
import DefaultStorage from "./storage";

export class LevelStorage {
  public static readonly LatestLevelsKey: string = "latestLevels";
  public static readonly LatestPasswordSuffix: string = ":::::pwd";

  private readonly storage: Storage;

  public constructor(storage?: Storage) {
    this.storage = storage ?? DefaultStorage;
  }

  public async loadlatestLevels(): Promise<IStoredLevel | undefined> {
    const latestLevelValue = this.storage.getItem(LevelStorage.LatestLevelsKey);
    if (!latestLevelValue) {
      return undefined;
    }

    let latestLevel: ILatestLevel | undefined = undefined;

    if (latestLevelValue.startsWith("{")) {
      latestLevel = JSON.parse(latestLevelValue);
    } else {
      const pwd = await this.getLatestPassword(latestLevelValue);
      latestLevel = {
        uri: latestLevelValue,
        password: pwd || "",
      };
    }

    if (latestLevel && latestLevel.uri) {
      if (latestLevel.uri.indexOf("http") === 0) {
        const levels = await getRemoteLevels(latestLevel.uri);
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
    this.storage.setItem(LevelStorage.LatestLevelsKey, uri);
    this.storage.setItem(uri + LevelStorage.LatestPasswordSuffix, password);

    return Promise.resolve();
  }

  public getLatestPassword(uri: string): Promise<string | undefined> {
    const found = this.storage.getItem(uri + LevelStorage.LatestPasswordSuffix) || undefined;
    return Promise.resolve(found);
  }
}

export interface IStoredLevel {
  levelSet: ILevelSet;
  password: string;
}

export interface ILatestLevel {
  uri: string;
  password: string;
}
