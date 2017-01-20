import "material-design-lite";

export function showErrorMessage(message: string): void {
  this.showMessage(message, "red", 5000);
}

export function showMessage(message: string, color: string = "green", timeout: number = 2000): void {
  const messageContainer = document.getElementById("message") as any;
  messageContainer.setAttribute("class", "mdl-js-snackbar mdl-snackbar mdl-color--" + color);

  componentHandler.upgradeElement(messageContainer);

  const data = {
    message: message,
    timeout: timeout
  };

  messageContainer.MaterialSnackbar.showSnackbar(data);
}
