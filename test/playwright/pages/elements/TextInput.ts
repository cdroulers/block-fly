import { Locator } from "@playwright/test";

export class TextInput {
  public constructor(private locator: Locator) {}

  public async fill(text: string): Promise<void> {
    await this.locator.fill(text);
  }
}
