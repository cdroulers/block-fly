// TODO: Support other things than localStorage for older browsers.
class DefaultStorage implements Storage {
  public get length(): number {
    if (localStorage) {
      return localStorage.length;
    }

    return 0;
  }

  public clear(): void {
    if (localStorage) {
      localStorage.clear();
    }
  }

  public getItem(key: string): string | undefined {
    if (localStorage) {
      return localStorage.getItem(key);
    }

    return undefined;
  }

  public key(index: number): string | undefined {
    if (localStorage) {
      return localStorage.key(index);
    }

    return undefined;
  }

  public removeItem(key: string): void {
    if (localStorage) {
      localStorage.removeItem(key);
    }

    return undefined;
  }

  public setItem(key: string, data: string): void {
    if (localStorage) {
      localStorage.setItem(key, data);
    }

    return undefined;
  }

  [key: string]: any;

  [index: number]: string;
}

export default new DefaultStorage();
