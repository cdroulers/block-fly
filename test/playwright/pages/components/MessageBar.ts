import { type Locator, Page, expect } from "@playwright/test";

export class MessageBar {
  public container: Locator;
  public text: Locator;

  constructor(private page: Page) {
    this.container = this.page.locator("#message");
    this.text = this.page.locator(".mdl-snackbar__text");
  }

  public async shouldHaveText(text: string): Promise<void> {
    await expect(this.text).toHaveText(text);
  }
}
