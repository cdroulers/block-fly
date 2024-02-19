import { LevelSetBuilder } from "../game/__tests__/levelSetBuilder";
import { StorageFake } from "./__mocks__/storageFake";
import { LatestLevelBuilder } from "./__tests__/latestLevelBuilder";
import { LevelStorage } from "./levelStorage";

const defaultFileName = "file:///C:/lol.json";

describe("!unit! levelStorage", () => {
  let storage: StorageFake;
  let levelStorage: LevelStorage;

  beforeEach(() => {
    storage = new StorageFake();
    levelStorage = new LevelStorage(storage);
  });

  describe("loadLatestLevels", () => {
    it("When loading empty levels Then returns null", async () => {
      const results = await levelStorage.loadlatestLevels();
      expect(results).toBeUndefined();
    });

    it("(with full JSON) When loading unknown levels Then throws", async () => {
      storage.setItem(
        LevelStorage.LatestLevelKey,
        JSON.stringify(new LatestLevelBuilder().withUri("ftp://lol.com/test.json").build())
      );

      await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
        new Error("Don't know how to reload levels at ftp://lol.com/test.json")
      );
    });

    it("(with full JSON) When loading file level that is missing Then throws", async () => {
      storage.setItem(
        LevelStorage.LatestLevelKey,
        JSON.stringify(new LatestLevelBuilder().withUri("file:///C:/lol.json").build())
      );

      await expect(() => levelStorage.loadlatestLevels()).rejects.toThrow(
        new Error("Don't have file:///C:/lol.json in local cache, you'll have to reload it!")
      );
    });

    it("(with full JSON) When loading file level that exists Then returns it", async () => {
      storage.setItem(
        LevelStorage.LatestLevelKey,
        JSON.stringify(
          new LatestLevelBuilder().withUri(defaultFileName).withPassword("QUE").build()
        )
      );

      storage.setItem(
        defaultFileName,
        JSON.stringify(new LevelSetBuilder().withName("WAT").build())
      );
      const levelSet = await levelStorage.loadlatestLevels();

      expect(levelSet?.levelSet.name).toBe("WAT");
      expect(levelSet?.password).toBe("QUE");
    });
  });

  describe("storeLatestLevels", () => {
    it("When storing latest levels Then sets item", async () => {
      storage.setItem(
        defaultFileName,
        JSON.stringify(new LevelSetBuilder().withName("WAT").build())
      );
      await levelStorage.storeLatestLevels(defaultFileName, "QUE");

      const levelSet = await levelStorage.loadlatestLevels();

      expect(levelSet?.levelSet.name).toBe("WAT");
      expect(levelSet?.password).toBe("QUE");
    });
  });

  describe("getLatestPassword", () => {
    it("When no value exists Then it returns undefined", async () => {
      const latestPassword = await levelStorage.getLatestPassword(defaultFileName);
      expect(latestPassword).toBeUndefined();
    });

    it("When a value exists Then it works", async () => {
      storage.setItem(defaultFileName + LevelStorage.LatestPasswordSuffix, "QUE");

      const latestPassword = await levelStorage.getLatestPassword(defaultFileName);
      expect(latestPassword).toBe("QUE");
    });
  });

  describe("all", () => {
    it("When you use all methods together Then it works", async () => {
      const otherFileName = "file:///home/test/wat.json";
      storage.setItem(
        defaultFileName,
        JSON.stringify(new LevelSetBuilder().withName("WAT").build())
      );

      await levelStorage.storeLatestLevels(otherFileName, "PWD");
      await levelStorage.storeLatestLevels(defaultFileName, "QUE");

      const levelSet = await levelStorage.loadlatestLevels();

      expect(levelSet?.levelSet.name).toBe("WAT");
      expect(levelSet?.password).toBe("QUE");

      const pwd = await levelStorage.getLatestPassword(otherFileName);

      expect(pwd).toBe("PWD");
    });
  });
});
