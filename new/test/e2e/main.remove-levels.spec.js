import IndexPage from "./pages/IndexPage";

fixture`Load remote levels`.page("http://localhost:5555/");

const indexPage = new IndexPage();

test("Via menu", async (t) => {
  await t
    .click(indexPage.menu.loadRemoteLevels)
    .typeText(indexPage.dialogs.remoteLevels.url, "assets/children-levels.json")
    .click(indexPage.dialogs.remoteLevels.submit)
    .expect(indexPage.levelIndicator.textContent)
    .contains("1 - Go left (password: oMG)");
});
