import { type Locator, Page, expect } from "@playwright/test";
import { EnterPasswordDialog } from "./dialogs/EnterPasswordDialog";
import { MessageBar } from "./components/MessageBar";
import { RemoteLevelsDialog } from "./dialogs/RemoteLevelsDialog";
import { LocalLevelsDialog } from "./dialogs/LocalLevelsDialog";

export class IndexPage {
  private readonly page: Page;
  private readonly levelIndicator: Locator;

  public messageBar: MessageBar;

  public constructor(page: Page) {
    this.page = page;
    this.levelIndicator = this.page.locator("#level-indicator");
    this.messageBar = new MessageBar(this.page);
  }

  public async shouldHaveLevelIndicator(s: string): Promise<void> {
    await expect(this.levelIndicator).toHaveText(s);
  }

  public async openPasswordDialog(): Promise<EnterPasswordDialog> {
    await this.page.locator(".mdl-navigation__link", { hasText: "Enter a password" }).click();
    return new EnterPasswordDialog(this.page, "#enter-password");
  }

  public async openRemoteLevelsDialog(): Promise<RemoteLevelsDialog> {
    await this.page.locator(".mdl-navigation__link", { hasText: "Load remote levels" }).click();
    return new RemoteLevelsDialog(this.page, "#load-remote-file-dialog");
  }

  public async openLocalLevelsDialog(): Promise<LocalLevelsDialog> {
    await this.page.locator(".mdl-navigation__link", { hasText: "Load local levels" }).click();
    return new LocalLevelsDialog(this.page, "#load-local-file-dialog");
  }

  public async loadChildrenLevels(): Promise<void> {
    await this.page
      .locator(".mdl-navigation__link", { hasText: "Load children's tutorial levels" })
      .click();
  }

  public async loadDefaultLevels(): Promise<void> {
    await this.page.locator(".mdl-navigation__link", { hasText: "Load default levels" }).click();
  }
}
