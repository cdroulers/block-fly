import { Page } from "@playwright/test";
import { Dialog } from "./Dialog";
import { Button } from "../elements/Button";
import { TextInput } from "../elements/TextInput";

export class EnterPasswordDialog extends Dialog {
  public password: TextInput;
  public submitButton: Button;

  constructor(page: Page, selector: string) {
    super(page, selector);

    this.password = new TextInput(this.content.locator("#level-password"));
    this.submitButton = new Button(this.actions.locator("button[type='submit']"));
  }
}
