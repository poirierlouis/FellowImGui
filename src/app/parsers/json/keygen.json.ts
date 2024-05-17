export class FIGJsonKeygen {
  private static readonly keys: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private index: number = 0;

  public next(): string {
    return FIGJsonKeygen.keys[this.index++];
  }
}
