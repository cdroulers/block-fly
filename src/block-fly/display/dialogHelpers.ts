export function setupDialogs(): void {
  const dialogs = document.querySelectorAll("dialog");
  for (let i = 0; i < dialogs.length; i++) {
    const diag = dialogs[i] as HTMLDialogElement;
    if (!diag.showModal) {
      /* dialogPolyfill.registerDialog(loadLocalDialog); */
    }
    diag.querySelector(".close").addEventListener("click", () => {
      diag.close();
    });
  }
}
