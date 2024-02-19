import { ILatestLevel } from "../levelStorage";

export class LatestLevelBuilder {
  private latestLevel: Partial<ILatestLevel> = {};

  public withUri(uri: string): LatestLevelBuilder {
    this.latestLevel.uri = uri;
    return this;
  }

  public withPassword(password: string): LatestLevelBuilder {
    this.latestLevel.password = password;
    return this;
  }

  public build(): ILatestLevel {
    return {
      uri: this.latestLevel.uri || "file:///home/user/test.json",
      password: this.latestLevel.password || "number1",
    };
  }
}
