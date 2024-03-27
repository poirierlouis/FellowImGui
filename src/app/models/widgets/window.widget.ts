import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size} from "../math";
import {getEnumValues} from "../enum";

export enum FIGWindowFlags {
  NoTitleBar = 1,
  NoResize = 2,
  NoMove = 4,
  NoScrollbar = 8,
  NoScrollWithMouse = 16,
  NoCollapse = 32,
  NoDecoration = 43,
  AlwaysAutoResize = 64,
  NoBackground = 128,
  NoSavedSettings = 256,
  NoMouseInputs = 512,
  MenuBar = 1024,
  HorizontalScrollbar = 2048,
  NoFocusOnAppearing = 4096,
  NoBringToFrontOnFocus = 8192,
  AlwaysVerticalScrollbar = 16384,
  AlwaysHorizontalScrollbar = 32768,
  AlwaysUseWindowPadding = 65536,
  NoNavInputs = 262144,
  NoNavFocus = 524288,
  NoNav = 786432,
  NoInputs = 786944,
  UnsavedDocument = 1048576,
  NavFlattened = 8388608
}

export interface FIGWindowOptions {
  readonly label?: string;
  readonly size?: Size;
  readonly flags?: number;
}

export class FIGWindowWidget extends FIGContainer {
  public static readonly flags: FIGWindowFlags[] = getEnumValues(FIGWindowFlags);

  label: string;
  size: Size;
  flags: number;

  constructor(options?: FIGWindowOptions) {
    super(FIGWidgetType.window, false);
    this.label = options?.label ?? 'Window';
    this.size = options?.size ?? {width: 320, height: 240};
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    if (this.isFocused) {
      ImGui.SetNextWindowFocus();
    }
    ImGui.SetNextWindowSize(new ImGui.Vec2(this.size.width, this.size.height));
    let open: boolean = true;

    ImGui.Begin(this.label, (_ = open) => open = _, this.flags);
    for (const child of this.children) {
      child.draw();
      child.listen();
    }
    this.listenSize();
    ImGui.End();
  }

  private listenSize(): void {
    if (ImGui.IsWindowCollapsed()) {
      return;
    }
    const size = ImGui.GetWindowSize();

    if (this.size.width === size.x && this.size.height === size.y) {
      return;
    }
    this.size.width = size.x;
    this.size.height = size.y;
    this.triggerUpdate();
  }
}
