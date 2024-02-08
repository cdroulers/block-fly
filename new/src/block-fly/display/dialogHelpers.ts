export function setupDialogs(): void {
  const dialogs = document.querySelectorAll("dialog");

  if (!dialogs[0].showModal) {
    // Load the dialog-polyfill ONLY IF necessary!
    document.getElementsByTagName("body")[0].classList.add("no-dialog");
    (require as any).ensure(
      ["dialog-polyfill"],
      (require) => {
        const dialogPolyfill = require("dialog-polyfill"); // tslint:disable-line no-require-imports
        for (let i = 0; i < dialogs.length; i++) {
          dialogPolyfill.registerDialog(dialogs[i]);
        }
      },
      "dialog-polyfill");
  }

  for (let i = 0; i < dialogs.length; i++) {
    const diag = dialogs[i];
    diag.querySelector(".close").addEventListener("click", () => {
      diag.close();
    });
  }
}
