import IndexPage from "./pages/IndexPage";

fixture`Load default levels`.page("http://localhost:5555/");

const indexPage = new IndexPage();

test("Via menu", async (t) => {
  await t
    .click(indexPage.menu.loadChildrensLevels)
    .expect(indexPage.levelIndicator.textContent)
    .contains("1 - Go left (password: oMG)")
    .click(indexPage.menu.loadDefaultLevels)
    .expect(indexPage.levelIndicator.textContent)
    .contains("1 - Level 1 (password: tcP)");
});
