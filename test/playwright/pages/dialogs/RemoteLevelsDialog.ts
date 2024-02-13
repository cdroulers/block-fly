import { Page } from "@playwright/test";
import { Dialog } from "./Dialog";
import { Button } from "../elements/Button";
import { TextInput } from "../elements/TextInput";

export class RemoteLevelsDialog extends Dialog {
  public url: TextInput;
  public submitButton: Button;

  constructor(page: Page, selector: string) {
    super(page, selector);

    this.url = new TextInput(this.content.locator("#remote-levels"));
    this.submitButton = new Button(this.actions.locator("button[type='submit']"));
  }
}
