import IndexPage from './page-model';

fixture `Left menu`
    .page('http://localhost:5555/');

const indexPage = new IndexPage();

test('enter password', async t => {
    await t
        .expect(indexPage.layout.visible).ok()
        .click(indexPage.menu.enterPassword)
        .typeText(indexPage.dialogs.enterPassword.password, 'wrong')
        .click(indexPage.dialogs.enterPassword.submit)
        .expect(indexPage.messageBar.text.textContent).contains("Couldn't find a level with password wrong.")
        .click(indexPage.menu.enterPassword)
        .click(indexPage.dialogs.enterPassword.cancel)
        .expect(indexPage.dialogs.enterPassword.visible).notOk();
});
