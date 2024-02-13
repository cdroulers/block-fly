import { test } from "@playwright/test";
import { IndexPage } from "./pages/IndexPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5555/");
});

test.describe("Load remote levels by URL", () => {
  test("Via menu", async ({ page }) => {
    const p = new IndexPage(page);
    const remoteLevelsDialog = await p.openRemoteLevelsDialog();
    await remoteLevelsDialog.url.fill("children-levels.json");
    await remoteLevelsDialog.submitButton.click();
    await p.shouldHaveLevelIndicator("1 - Go left (password: oMG)");
  });
});
