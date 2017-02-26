import IndexPage from "./pages/IndexPage";

fixture `Left menu password entering`
    .page('http://localhost:5555/');

const indexPage = new IndexPage();

test("enter bad password", async t => {
  await t
      .expect(indexPage.layout.visible).ok()
      .click(indexPage.menu.enterPassword)
      .typeText(indexPage.dialogs.enterPassword.password, "wrong")
      .click(indexPage.dialogs.enterPassword.submit)
      .expect(indexPage.messageBar.text.textContent).contains("Couldn't find a level with password wrong.");
});

test("cancel password", async t => {
  await t
      .expect(indexPage.layout.visible).ok()
      .click(indexPage.menu.enterPassword)
      .click(indexPage.dialogs.enterPassword.cancel)
      .expect(indexPage.dialogs.enterPassword.visible).notOk();
});

test("Goes to level", async t => {
  await t
      .expect(indexPage.layout.visible).ok()
      .click(indexPage.menu.enterPassword)
      .typeText(indexPage.dialogs.enterPassword.password, "wTF")
      .click(indexPage.dialogs.enterPassword.submit)
      .expect(indexPage.dialogs.enterPassword.visible).notOk()
      .expect(indexPage.levelIndicator.textContent).contains("11 - Level 11 (password: wTF)");
});
