import { test } from "@playwright/test";
import { IndexPage } from "./pages/IndexPage";
import path from "path";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5555/");
});

test.describe("Load local levels by uploading file", () => {
  test("Via menu", async ({ page }) => {
    const p = new IndexPage(page);
    const localLevelsDialog = await p.openLocalLevelsDialog();
    await localLevelsDialog.url.setFileToUpload("./public/children-levels.json");
    await localLevelsDialog.submitButton.click();
    await p.shouldHaveLevelIndicator("1 - Go left (password: oMG)");
  });
});
