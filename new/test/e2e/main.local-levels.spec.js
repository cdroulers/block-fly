import IndexPage from "./pages/IndexPage";

fixture `Load local levels`
    .page('http://localhost:5555/');

const indexPage = new IndexPage();

test("Via menu", async t => {
  await t
      .click(indexPage.menu.loadLocalLevels)
      .setFilesToUpload(indexPage.dialogs.localLevels.url, "../../src/public/assets/children-levels.json")
      .click(indexPage.dialogs.localLevels.submit)
      .expect(indexPage.levelIndicator.textContent).contains("1 - Go left (password: oMG)");
});
