import { Selector } from "testcafe";

class Dialog {
  public dialog: Selector;
  protected title: Selector;
  protected content: Selector;
  protected actions: Selector;

  constructor(selector: string) {
    this.dialog = Selector(selector);
    this.title = this.dialog.find(".mdl-dialog__title");
    this.content = this.dialog.find(".mdl-dialog__content");
    this.actions = this.dialog.find(".mdl-dialog__actions");
  }
}

class EnterPasswordDialog extends Dialog {
  public password: Selector;
  public submit: Selector;
  public cancel: Selector;

  constructor(selector: string) {
    super(selector);

    this.password = this.content.find("#level-password");
    this.submit = this.actions.find("button[type='submit']");
    this.cancel = this.actions.find("button.close");
  }
}

class RemoteLevelsDialog extends Dialog {
  public url: Selector;
  public submit: Selector;
  public cancel: Selector;

  constructor(selector: string) {
    super(selector);

    this.url = this.content.find("#remote-levels");
    this.submit = this.actions.find("button[type='submit']");
    this.cancel = this.actions.find("button.close");
  }
}

class LocalLevelsDialog extends Dialog {
  public url: Selector;
  public submit: Selector;
  public cancel: Selector;

  constructor(selector: string) {
    super(selector);

    this.url = this.content.find("#local-levels");
    this.submit = this.actions.find("button[type='submit']");
    this.cancel = this.actions.find("button.close");
  }
}

class MessageBar {
  public container: Selector;
  public text: Selector;

  constructor() {
    this.container = Selector("#message");
    this.text = Selector(".mdl-snackbar__text");
  }
}

export default class IndexPage {
  public layout: Selector;
  public menu: {
    enterPassword: Selector;
    loadChildrensLevels: Selector;
    loadDefaultLevels: Selector;
    loadRemoteLevels: Selector;
    loadLocalLevels: Selector;
  };
  public dialogs: {
    enterPassword: EnterPasswordDialog;
    remoteLevels: RemoteLevelsDialog;
    localLevels: LocalLevelsDialog;
  };
  public levelIndicator: Selector;
  public messageBar: MessageBar;

  constructor() {
    this.layout = Selector(".mdl-layout__container");
    this.menu = {
      enterPassword: Selector(".mdl-navigation__link").withText("Enter a password"),
      loadChildrensLevels: Selector(".mdl-navigation__link").withText(
        "Load children's tutorial levels"
      ),
      loadDefaultLevels: Selector(".mdl-navigation__link").withText("Load default levels"),
      loadRemoteLevels: Selector(".mdl-navigation__link").withText("Load remote levels"),
      loadLocalLevels: Selector(".mdl-navigation__link").withText("Load local levels"),
    };

    this.dialogs = {
      enterPassword: new EnterPasswordDialog("#enter-password"),
      remoteLevels: new RemoteLevelsDialog("#load-remote-file-dialog"),
      localLevels: new LocalLevelsDialog("#load-local-file-dialog"),
    };

    this.messageBar = new MessageBar();

    this.levelIndicator = Selector("#level-indicator");
  }
}
