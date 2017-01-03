import "material-design-lite";

export function showMessage(message: string): void {
  const messageContainer = document.getElementById("message") as any;

  componentHandler.upgradeElement(messageContainer);

  const data = {
      message: message,
      timeout: 2000
    };

  messageContainer.MaterialSnackbar.showSnackbar(data);
}
