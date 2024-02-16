import { StorageFake } from "./__mocks__/storageFake";
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
      JSON.stringify({ uri: "ftp://lol.com/test.json" })
    );

    await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
      new Error("Don't know how to reload levels at ftp://lol.com/test.json")
    );
  });

  it("When loading file level that is missing Then throws", async () => {
    storage.setItem(LevelStorage.LatestLevelsKey, JSON.stringify({ uri: "file:///C:/lol.json" }));

    await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
      new Error("Don't have file:///C:/lol.json in local cache, you'll have to reload it!")
    );
  });
});
