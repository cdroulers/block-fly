import { Selector } from "testcafe";

class Dialog {
  constructor (selector) {
    this.dialog  = Selector(selector);
    this.title   = this.dialog.find(".mdl-dialog__title");
    this.content = this.dialog.find(".mdl-dialog__content");
    this.actions = this.dialog.find(".mdl-dialog__actions");
  }
}

class EnterPasswordDialog extends Dialog {
  constructor (selector) {
    super(selector);

    this.password = this.content.find("#level-password");
    this.submit   = this.actions.find("button[type='submit']");
    this.cancel   = this.actions.find("button.close");
  }
}

class RemoteLevelsDialog extends Dialog {
  constructor (selector) {
    super(selector);

    this.url = this.content.find("#remote-levels");
    this.submit   = this.actions.find("button[type='submit']");
    this.cancel   = this.actions.find("button.close");
  }
}

class LocalLevelsDialog extends Dialog {
  constructor (selector) {
    super(selector);

    this.url = this.content.find("#local-levels");
    this.submit   = this.actions.find("button[type='submit']");
    this.cancel   = this.actions.find("button.close");
  }
}

class MessageBar {
  constructor () {
    this.container = Selector("#message");
    this.text      = Selector(".mdl-snackbar__text");
  }
}

export default class IndexPage {
  constructor () {
    this.layout = Selector(".mdl-layout__container");
    this.menu   = {
      enterPassword: Selector(".mdl-navigation__link").withText("Enter a password"),
      loadChildrensLevels: Selector(".mdl-navigation__link").withText("Load children's tutorial levels"),
      loadDefaultLevels: Selector(".mdl-navigation__link").withText("Load default levels"),
      loadRemoteLevels: Selector(".mdl-navigation__link").withText("Load remote levels"),
      loadLocalLevels: Selector(".mdl-navigation__link").withText("Load local levels")
    };

    this.dialogs = {
      enterPassword: new EnterPasswordDialog("#enter-password"),
      remoteLevels: new RemoteLevelsDialog("#load-remote-file-dialog"),
      localLevels: new LocalLevelsDialog("#load-local-file-dialog")
    };

    this.messageBar = new MessageBar();

    this.levelIndicator = Selector("#level-indicator");
  }
}
