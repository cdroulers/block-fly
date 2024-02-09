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

  public getItem(key: string): string | null {
    if (localStorage) {
      return localStorage.getItem(key);
    }

    return null;
  }

  public key(index: number): string | null {
    if (localStorage) {
      return localStorage.key(index);
    }

    return null;
  }

  public removeItem(key: string): void {
    if (localStorage) {
      localStorage.removeItem(key);
    }
  }

  public setItem(key: string, data: string): void {
    if (localStorage) {
      localStorage.setItem(key, data);
    }
  }

  [key: string]: any;

  [index: number]: string;
}

export default new DefaultStorage();
