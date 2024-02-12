import { updateModifier } from "../block-fly/display/defaultControls";

export function bindDefaultControls(): void {
  window.addEventListener("keydown", (e) => {
    if (document.activeElement?.tagName === "INPUT") {
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey) {
      // Do not mess with default shortcuts.
      return;
    }

    if (e.shiftKey) {
      updateModifier(e);
      return;
    }

    e.preventDefault();
  });

  const helpDialog = document.getElementById("help-dialog") as HTMLDialogElement;

  document.getElementById("help")!.addEventListener("click", (evt: Event) => {
    evt.preventDefault();

    helpDialog.showModal();
  });
}
