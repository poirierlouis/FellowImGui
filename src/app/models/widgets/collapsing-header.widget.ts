import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {getEnumValues} from "../enum";

export enum FIGCollapsingHeaderFlags {
  Selected = 1,
  Framed = 2,
  AllowOverlap = 4,
  NoTreePushOnOpen = 8,
  NoAutoOpenOnLog = 16,
  DefaultOpen = 32,
  OpenOnDoubleClick = 64,
  OpenOnArrow = 128,
  Leaf = 256,
  Bullet = 512,
  FramePadding = 1024,
  SpanAvailWidth = 2048,
  SpanFullWidth = 4096,
  NavLeftJumpsBackHere = 8192
}

export interface FIGCollapsingHeaderOptions {
  readonly label?: string;
  readonly flags?: number;
}

export class FIGCollapsingHeaderWidget extends FIGContainer {
  public static readonly flags: FIGCollapsingHeaderFlags[] = getEnumValues(FIGCollapsingHeaderFlags);

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

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type !== FIGWidgetType.window && type !== FIGWidgetType.tabItem;
  }

  public override draw(): void {
    const isOpen: boolean = ImGui.CollapsingHeader(this.label, this.flags);

    this.growFocusRect();
    if (isOpen) {
      for (const child of this.children) {
        child.draw();
        this.growFocusRect();
      }
    }
    super.drawFocus();
  }
}
