import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import { getViewport } from "../../src/block-fly/display/viewport";

const parser = new BoardParser();

describe("!unit! Viewport", () => {
  it("Properly gets viewport for centered player odd width", () => {
    const board = parser.parse(`
        #      #
        #      #
        #D  P  #
        ########
      `);

    const vp = getViewport(board, { width: 3, height: 3 });

    expect(vp).toStrictEqual({ x: 3, y: 1 });
  });

  it("Properly gets viewport for centered player even width", () => {
    const board = parser.parse(`
        #      #
        #      #
        #D  P  #
        ########
      `);

    const vp = getViewport(board, { width: 6, height: 3 });

    expect(vp).toStrictEqual({ x: 1, y: 1 });
  });

  it("Properly gets viewport for player on the bottom right", () => {
    const board = parser.parse(`
        #      #
        #      #
        #      #
        #D    P#
        ########
      `);

    const vp = getViewport(board, { width: 6, height: 4 });

    expect(vp).toStrictEqual({ x: 2, y: 1 });
  });

  it("Properly gets viewport for player on the bottom left", () => {
    const board = parser.parse(`
        #      #
        #      #
        #      #
        #DP    #
        ########
      `);

    const vp = getViewport(board, { width: 6, height: 4 });

    expect(vp).toStrictEqual({ x: 0, y: 1 });
  });

  it("Properly gets viewport for player on the top left", () => {
    const board = parser.parse(`
        #P     #
        ##     #
        #     D#
        ########
      `);

    const vp = getViewport(board, { width: 6, height: 4 });

    expect(vp).toStrictEqual({ x: 0, y: 0 });
  });

  it("Properly gets viewport for player on the top right", () => {
    const board = parser.parse(`
        #     P#
        #     ##
        #     D#
        ########
      `);

    const vp = getViewport(board, { width: 6, height: 4 });

    expect(vp).toStrictEqual({ x: 2, y: 0 });
  });

  describe("with modifier", () => {
    it("Properly gets viewport for player on the top right with modifier left/down", () => {
      const board = parser.parse(`
        #     P#
        #     ##
        #      #
        #     D#
        ########
      `);

      const vp = getViewport(board, { width: 6, height: 4 }, { x: -1, y: 1 });

      expect(vp).toStrictEqual({ x: 1, y: 1 });
    });

    it("Properly gets viewport for player on the bottom left with modifier right/up", () => {
      const board = parser.parse(`
        #      #
        #      #
        #      #
        #DP    #
        ########
      `);

      const vp = getViewport(board, { width: 6, height: 4 }, { x: 1, y: -1 });

      expect(vp).toStrictEqual({ x: 1, y: 0 });
    });
  });
});
