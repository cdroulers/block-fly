import "material-design-lite";

export function showMessage(message: string): void {
  let messageContainer = document.getElementById("message") as any;

  componentHandler.upgradeElement(messageContainer);

  let data = {
      message: message,
      timeout: 2000
    };

  messageContainer.MaterialSnackbar.showSnackbar(data);
}
