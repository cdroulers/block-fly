import BoardParser from "../../src/block-fly/game/symbolsBoardParser";
import { getActualDimensions } from "../../src/block-fly/display/canvasDisplay";

const parser = new BoardParser();

describe("!unit! CanvasDisplay", () => {
  it("Gets actual dimensions from window size", () => {
    const board = parser.parse(`
        #      #
        #      #
        #D  P  #
        ########
      `);

    const dimensions = getActualDimensions(board, { innerWidth: 180, innerHeight: 95 } as any);

    expect(dimensions).toStrictEqual({ width: 6, height: 3 });
  });

  it("Gets actual dimensions from window size", () => {
    const board = parser.parse(`
        #      #
        #      #
        #D  P  #
        ########
      `);

    const dimensions = getActualDimensions(board, { innerWidth: 1920, innerHeight: 1200 } as any);

    expect(dimensions).toStrictEqual({ width: 8, height: 4 });
  });
});
