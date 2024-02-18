import { ITextLevel } from "../level";

let latestId = 1;

export class TextLevelBuilder {
  private textLevel: Partial<ITextLevel> = {};

  public withName(name: string): TextLevelBuilder {
    this.textLevel.name = name;
    return this;
  }

  public withNumber(number: number): TextLevelBuilder {
    this.textLevel.number = number;
    return this;
  }

  public withPassword(password: string): TextLevelBuilder {
    this.textLevel.password = password;
    return this;
  }

  public withText(text: string | string[]): TextLevelBuilder {
    this.textLevel.text = Array.isArray(text) ? text.join("\n") : text;
    return this;
  }

  public build(): ITextLevel {
    const id = latestId++;
    return {
      name: this.textLevel.name || "Level #" + id,
      number: this.textLevel.number || id,
      password: this.textLevel.password || "pwd" + id,
      text: this.textLevel.text || defaultLevel,
    };
  }
}

export const defaultLevel = ["#        #", "#D      P#", "##########"].join("\n");
