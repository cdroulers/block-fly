import { expect } from "chai";
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
          { number: 2, text: "#DP #\n#####" }
        ]
      };
      const levelSet = new LevelSet(levels, parser);

      expect(levelSet.currentLevel.width).to.equal(4);

      levelSet.nextLevel();

      expect(levelSet.currentLevel.width).to.equal(5);
    });

    it("calls callbacks", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####" },
          { number: 3, text: "#DP  #\n######" }
        ]
      };
      const levelSet = new LevelSet(levels, parser);

      levelSet.onLevelFinished = () => {
        levelSet.nextLevel();
      };

      let setFinished = false;
      levelSet.onSetFinished = () => {
        setFinished = true;
      };

      expect(levelSet.currentLevel.width).to.equal(4);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).to.equal(5);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).to.equal(6);

      levelSet.currentLevel.move(1, Move.Left);
      expect(levelSet.currentLevel.width).to.equal(6);
      expect(setFinished).to.be.true;
    });
  });

  describe("goToLevelWithPassword", () => {
    it("finds the level", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####", password: "lol" }
        ]
      };
      const levelSet = new LevelSet(levels, parser);

      expect(levelSet.currentLevel.number).to.equal(1);

      levelSet.goToLevelWithPassword("lol");
      expect(levelSet.currentLevel.number).to.equal(2);
    });

    it("throws error if not found", () => {
      const levels = {
        name: undefined,
        uri: "",
        levels: [
          { number: 1, text: "#DP#\n####" },
          { number: 2, text: "#DP #\n#####" },
          { number: 3, text: "#DP  #\n######" }
        ]
      };
      const levelSet = new LevelSet(levels, parser);

      expect(() => levelSet.goToLevelWithPassword("slkdjf")).to.throw(Error);
    });
  });
});
