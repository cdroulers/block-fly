import "material-design-lite";

export function showErrorMessage(message: string): void {
  showMessage(message, "red", 5000);
}

declare interface SnackbarContainer extends HTMLElement {
  MaterialSnackbar: any;
}

export function showMessage(
  message: string,
  color: string = "green",
  timeout: number = 2000
): void {
  const messageContainer = document.getElementById("message") as SnackbarContainer;
  componentHandler.upgradeElement(messageContainer);
  messageContainer.setAttribute("class", "mdl-js-snackbar mdl-snackbar mdl-color--" + color);
  messageContainer.MaterialSnackbar.showSnackbar({
    message: message,
    timeout: timeout,
  });
}
