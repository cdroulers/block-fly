import { Locator, Page, expect } from "@playwright/test";
import { Button } from "../elements/Button";

export abstract class Dialog {
  public dialog: Locator;
  protected title: Locator;
  protected content: Locator;
  protected actions: Locator;

  public closeButton: Button;

  constructor(page: Page, selector: string) {
    this.dialog = page.locator(selector);
    this.title = this.dialog.locator(".mdl-dialog__title");
    this.content = this.dialog.locator(".mdl-dialog__content");
    this.actions = this.dialog.locator(".mdl-dialog__actions");

    this.closeButton = new Button(this.actions.locator("button.close"));
  }

  public async shouldNotBeVisible(): Promise<void> {
    await expect(this.dialog).toBeHidden();
  }
}
