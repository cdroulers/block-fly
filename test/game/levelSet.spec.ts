import { Move } from "../../src/block-fly/game/board";
import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import LevelSet from "../../src/block-fly/game/levelSet";

const parser = new BoardParser();

describe("!unit! LevelSet", () => {
  describe("nextLevel", () => {
    it("works with levels", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####" },
        ],
      };
      const levelSet = new LevelSet(levels, parser);

      expect(levelSet.currentLevel.width).toBe(4);

      levelSet.nextLevel();

      expect(levelSet.currentLevel.width).toBe(5);
    });

    it("calls callbacks", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####" },
          { number: 3, text: "#DP  #\n######" },
        ],
      };
      const levelSet = new LevelSet(levels, parser);

      levelSet.onLevelFinished = () => {
        levelSet.nextLevel();
      };

      let setFinished = false;
      levelSet.onSetFinished = () => {
        setFinished = true;
      };

      expect(levelSet.currentLevel.width).toBe(4);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).toBe(5);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).toBe(6);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).toBe(6);
      expect(setFinished).toBeTruthy();
    });
  });

  describe("goToLevelWithPassword", () => {
    it("finds the level", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####", password: "lol" },
        ],
      };
      const levelSet = new LevelSet(levels, parser);

      expect(levelSet.currentLevel.number).toBe(1);

      levelSet.goToLevelWithPassword("lol");
      expect(levelSet.currentLevel.number).toBe(2);
    });

    it("throws error if not found", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####" },
          { number: 3, text: "#DP  #\n######" },
        ],
      };
      const levelSet = new LevelSet(levels, parser);

      expect(() => levelSet.goToLevelWithPassword("slkdjf")).toThrow(Error);
    });
  });
});
