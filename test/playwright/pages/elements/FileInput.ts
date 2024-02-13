import { Locator } from "@playwright/test";

export class FileInput {
  public constructor(private locator: Locator) {}

  public async setFileToUpload(path: string): Promise<void> {
    await this.locator.setInputFiles(path);
  }
}
