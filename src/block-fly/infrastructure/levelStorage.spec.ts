import { LevelSetBuilder } from "../game/__tests__/levelSetBuilder";
import { StorageFake } from "./__mocks__/storageFake";
import { LatestLevelBuilder } from "./__tests__/latestLevelBuilder";
import { LevelStorage } from "./levelStorage";

describe("levelStorage", () => {
  let storage: StorageFake;
  let levelStorage: LevelStorage;

  beforeEach(() => {
    storage = new StorageFake();
    levelStorage = new LevelStorage(storage);
  });

  it("When loading empty levels Then returns null", async () => {
    const results = await levelStorage.loadlatestLevels();
    expect(results).toBeUndefined();
  });

  it("When loading unknown levels Then throws", async () => {
    storage.setItem(
      LevelStorage.LatestLevelsKey,
      JSON.stringify(new LatestLevelBuilder().withUri("ftp://lol.com/test.json").build())
    );

    await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
      new Error("Don't know how to reload levels at ftp://lol.com/test.json")
    );
  });

  it("When loading file level that is missing Then throws", async () => {
    storage.setItem(
      LevelStorage.LatestLevelsKey,
      JSON.stringify(new LatestLevelBuilder().withUri("file:///C:/lol.json").build())
    );

    await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
      new Error("Don't have file:///C:/lol.json in local cache, you'll have to reload it!")
    );
  });

  it("When loading file level that exists Then throws", async () => {
    const fileName = "file:///C:/lol.json";
    storage.setItem(
      LevelStorage.LatestLevelsKey,
      JSON.stringify(new LatestLevelBuilder().withUri(fileName).withPassword("QUE").build())
    );

    storage.setItem(fileName, JSON.stringify(new LevelSetBuilder().withName("WAT").build()));
    const levelSet = await levelStorage.loadlatestLevels();

    expect(levelSet?.levelSet.name).toBe("WAT");
    expect(levelSet?.password).toBe("QUE");
  });
});
