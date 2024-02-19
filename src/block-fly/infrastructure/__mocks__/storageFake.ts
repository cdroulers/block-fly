export class StorageFake implements Storage {
  private readonly values: Map<string, string> = new Map<string, string>();

  public get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(key) || null;
  }
  key(index: number): string | null {
    return [...this.values.keys()][index];
  }
  removeItem(key: string): void {
    this.values.delete(key);
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
