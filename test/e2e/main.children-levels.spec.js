import IndexPage from "./pages/IndexPage";

fixture `Load children's levels`
    .page('http://localhost:5555/');

const indexPage = new IndexPage();

test("Via menu", async t => {
  await t
      .expect(indexPage.layout.visible).ok()
      .click(indexPage.menu.loadChildrensLevels)
      .expect(indexPage.levelIndicator.textContent).contains("1 - Go left (password: oMG)");
});
