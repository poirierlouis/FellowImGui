import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";

export interface FIGCollapsingHeaderOptions {
  readonly label?: string;
  readonly flags?: number;
}

export class FIGCollapsingHeaderWidget extends FIGContainer {
  label: string;
  flags: number;

  constructor(options?: FIGCollapsingHeaderOptions) {
    super(FIGWidgetType.collapsingHeader, true);
    this.label = options?.label ?? 'Header';
    this.flags = options?.flags ?? 0;
    this._focusOffset.x = 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const isOpen: boolean = ImGui.CollapsingHeader(this.label, this.flags);

    this.growFocusRect();
    if (isOpen) {
      for (const child of this.children) {
        child.draw();
        child.listen();
        this.growFocusRect();
      }
    }
    super.drawFocus();
  }
}
