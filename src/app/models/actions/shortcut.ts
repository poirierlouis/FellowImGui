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

  public canDelete(event: KeyboardEvent): boolean {
    const target: HTMLElement | null = event.target as HTMLElement;
    const hasFocus: boolean = target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLCanvasElement;

    return !hasFocus && !this.ctrl && this.key === 'Delete';
  }
}
