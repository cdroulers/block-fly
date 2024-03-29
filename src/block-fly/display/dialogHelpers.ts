export function setupDialogs(): void {
  const dialogs = document.querySelectorAll("dialog");

  for (let i = 0; i < dialogs.length; i++) {
    const diag = dialogs[i];
    diag.querySelector(".close")!.addEventListener("click", () => {
      diag.close();
    });
  }
}
