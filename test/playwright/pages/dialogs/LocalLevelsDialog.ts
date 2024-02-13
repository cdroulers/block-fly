import { Page } from "@playwright/test";
import { Dialog } from "./Dialog";
import { Button } from "../elements/Button";
import { FileInput } from "../elements/FileInput";

export class LocalLevelsDialog extends Dialog {
  public url: FileInput;
  public submitButton: Button;

  constructor(page: Page, selector: string) {
    super(page, selector);

    this.url = new FileInput(this.content.locator("#local-levels"));
    this.submitButton = new Button(this.actions.locator("button[type='submit']"));
  }
}
