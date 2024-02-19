import { test } from "@playwright/test";
import { IndexPage } from "./pages/IndexPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5555/");
});

test.describe("Load level by password", () => {
  test("enter bad password", async ({ page }) => {
    const p = new IndexPage(page);
    const passwordDialog = await p.openPasswordDialog();
    await passwordDialog.password.fill("wrong");
    await passwordDialog.submitButton.click();
    await p.messageBar.shouldHaveText("Couldn't find a level with password wrong.");
  });

  test("cancel password dialog", async ({ page }) => {
    const p = new IndexPage(page);
    const passwordDialog = await p.openPasswordDialog();
    await passwordDialog.closeButton.click();
    await passwordDialog.shouldNotBeVisible();
  });

  test("Goes to specific level and comes back", async ({ page }) => {
    const p = new IndexPage(page);
    await p.shouldHaveLevelIndicator("1 - Level 1 (password: tcP)");
    const passwordDialog = await p.openPasswordDialog();
    await passwordDialog.password.fill("wTF");
    await passwordDialog.submitButton.click();
    await p.shouldHaveLevelIndicator("11 - Level 11 (password: wTF)");
    await p.loadChildrenLevels();
    await p.shouldHaveLevelIndicator("1 - Go left (password: oMG)");
  });
});
