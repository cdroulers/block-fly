import { LevelSetBuilder } from "../../game/__tests__/levelSetBuilder";
import { IStoredLevel } from "../levelStorage";

export class StoredLevelBuilder {
  private storedLevel: Partial<IStoredLevel> = {};

  public withLevelSet(
    builderFunc: (builder: LevelSetBuilder) => LevelSetBuilder
  ): StoredLevelBuilder {
    const builder = new LevelSetBuilder();
    builderFunc?.(builder);
    this.storedLevel.levelSet = builder.build();
    return this;
  }

  public withPassword(password: string): StoredLevelBuilder {
    this.storedLevel.password = password;
    return this;
  }

  public build(): IStoredLevel {
    return {
      levelSet: this.storedLevel.levelSet ?? new LevelSetBuilder().build(),
      password: this.storedLevel.password || "pwd",
    };
  }
}
