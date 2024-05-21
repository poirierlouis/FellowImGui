export class FIGShortcut {
  ctrl: boolean;
  key?: string;

  constructor() {
    this.ctrl = false;
    this.key = undefined;
  }

  public canSelect(): boolean {
    return this.ctrl;
  }

  public canDuplicate(): boolean {
    return this.ctrl && this.key === 'd';
  }

  public canGenerate(): boolean {
    return this.ctrl && this.key === 'g';
  }
}
