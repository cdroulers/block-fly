import { ILevelSet } from "../level";
import { TextLevelBuilder } from "./textLevelBuilder";

let latestId = 1;

export class LevelSetBuilder {
  private levelSet: Partial<ILevelSet> = {};

  public withName(name: string): LevelSetBuilder {
    this.levelSet.name = name;
    return this;
  }

  public withUri(uri: string): LevelSetBuilder {
    this.levelSet.uri = uri;
    return this;
  }

  public withLevel(builderFunc: (builder: TextLevelBuilder) => TextLevelBuilder): LevelSetBuilder {
    const builder = new TextLevelBuilder();
    builderFunc?.(builder);
    this.levelSet.levels = (this.levelSet.levels || []).concat(builder.build());
    return this;
  }

  public build(): ILevelSet {
    const id = latestId++;
    return {
      name: this.levelSet.name,
      uri: this.levelSet.uri || `file:///home/user/test${id}.json`,
      levels: this.levelSet.levels || [],
    };
  }
}
