export function checkDrawerButton(canvas: HTMLElement, imageSize: number): void {
  const drawerButton = document.querySelector(".mdl-layout__drawer-button");

  if (!drawerButton) {
    setTimeout(() => checkDrawerButton(canvas, imageSize), 50);
    return;
  }

  if (canvas.offsetLeft < imageSize) {
    drawerButton.classList.add("over-game");
  } else {
    drawerButton.classList.remove("over-game");
  }
}
