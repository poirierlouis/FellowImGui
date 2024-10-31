import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size} from "../math";
import {getEnumValues} from "../enum";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FlagOption, getOptions} from "../fields/flags.field";

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

export enum FIGWindowStyleVar {
  WindowPadding = 2,
  WindowRounding = 3,
  WindowBorderSize = 4,
  WindowMinSize = 5,
  WindowTitleAlign = 6
}

export enum FIGCondFlags {
  Always = 1,
  Once = 2,
  FirstUseEver = 4,
  Appearing = 8
}

export const FIGWindowFlagsOptions: FlagOption[] = getOptions(FIGWindowFlags);
export const FIGWindowCondFlagsOptions: FlagOption[] = getOptions(FIGCondFlags);

export interface FIGWindowOptions {
  readonly label?: string;
  readonly size?: Size;
  readonly flags?: number;
  readonly sizeFlags?: number;
  readonly minSize?: Size;
}

export class FIGWindowWidget extends FIGContainer {
  public static readonly flags: FIGWindowFlags[] = getEnumValues(FIGWindowFlags);
  public static readonly condFlags: FIGCondFlags[] = getEnumValues(FIGCondFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'size', optional: true, default: undefined, type: 'object', innerType: [{name: 'width'}, {name: 'height'}]},
    {name: 'flags', optional: true, default: 0},
    {name: 'sizeFlags', optional: true, default: 0},
    {
      name: 'minSize',
      optional: true,
      default: undefined,
      type: 'object',
      innerType: [{name: 'width'}, {name: 'height'}]
    }
  ];

  label: string = '';
  flags: number = 0;
  size?: Size;
  minSize?: Size;
  sizeFlags: number = 0;

  constructor(options?: FIGWindowOptions) {
    super(FIGWidgetType.window, false);
    this.registerString( 'label', 'Title', options?.label ?? 'Window');
    this.registerFlags('flags', 'Flags', FIGWindowFlagsOptions, options?.flags, true);
    this.registerSize('size', 'Size', false, options?.size, true);
    this.registerSize('minSize', 'Min size', false, options?.minSize, true);
    this.registerFlags('sizeFlags', 'Size flags', FIGWindowCondFlagsOptions, options?.sizeFlags, true);
  }

  public get name(): string {
    return this.label;
  }

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type !== FIGWidgetType.window && type !== FIGWidgetType.tabItem;
  }

  public override draw(): void {
    if (this.isFocused) {
      ImGui.SetNextWindowFocus();
    }
    if (this.minSize) {
      ImGui.PushStyleVar(FIGWindowStyleVar.WindowMinSize, {x: this.minSize.width, y: this.minSize.height});
    }
    if (this.size) {
      ImGui.SetNextWindowSize(new ImGui.Vec2(this.size.width, this.size.height), this.sizeFlags);
    }
    let open: boolean = true;

    ImGui.Begin(this.label, (_ = open) => open = _, this.flags);
    for (const child of this.children) {
      child.draw();
      child.listen();
    }
    this.listenSize();
    ImGui.End();
    if (this.minSize) {
      ImGui.PopStyleVar();
    }
  }

  private listenSize(): void {
    if (ImGui.IsWindowCollapsed() || !this.size) {
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
