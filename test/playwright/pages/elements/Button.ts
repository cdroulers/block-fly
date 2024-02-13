import { Locator } from "@playwright/test";

export class Button {
  public constructor(private locator: Locator) {}

  public async click(): Promise<void> {
    await this.locator.click();
  }
}
