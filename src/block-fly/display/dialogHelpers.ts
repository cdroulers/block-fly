import * as dialogPolyfill from "dialog-polyfill";

export function setupDialogs(): void {
  const dialogs = document.querySelectorAll("dialog");
  for (let i = 0; i < dialogs.length; i++) {
    const diag = dialogs[i] as HTMLDialogElement;
    if (!diag.showModal) {
      document.getElementsByTagName("body")[0].classList.add("no-dialog");
      dialogPolyfill.registerDialog(diag);
    }
    diag.querySelector(".close").addEventListener("click", () => {
      diag.close();
    });
  }
}
