interface HTMLDialogElement extends HTMLElement {
  close();

  show();

  showModal();
}

interface NodeSelector {
  querySelector(selectors: "dialog"): HTMLDialogElement;
  querySelectorAll(selectors: "dialog"): NodeListOf<HTMLDialogElement>;
}
