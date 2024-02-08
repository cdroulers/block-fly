import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as jsdom from "jsdom";

chai.use(chaiAsPromised as any);

// A super simple DOM ready for React to render into
// Store this DOM and the window in global scope ready for React to access
(global as any).document = jsdom.jsdom("<!doctype html><html><body></body></html>");
(global as any).window = document.defaultView;

propagateToGlobal((global as any).window);

// From mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(window: Window): void {
  for (const key in window) {
    if (!window.hasOwnProperty(key)) {
      continue;
    }

    if (key in global) {
      continue;
    }

    global[key] = window[key];
  }
}
