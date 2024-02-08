import IndexPage from "./pages/IndexPage";

fixture`Load default levels`.page("http://localhost:5555/");

const indexPage = new IndexPage();

test("Via menu", async (t) => {
  await t
    .click(indexPage.menu.enterPassword)
    .typeText(indexPage.dialogs.enterPassword.password, "wTF")
    .click(indexPage.dialogs.enterPassword.submit)
    .expect(indexPage.levelIndicator.textContent)
    .notContains("1 - Level 1 (password: tcP)")
    .click(indexPage.menu.loadDefaultLevels)
    .expect(indexPage.levelIndicator.textContent)
    .contains("1 - Level 1 (password: tcP)");
});
