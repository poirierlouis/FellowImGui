import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size} from "../math";

export interface FIGWindowOptions {
  readonly label?: string;
  readonly size?: Size;
}

export class FIGWindowWidget extends FIGContainer {
  label: string;
  size: Size;

  constructor(options?: FIGWindowOptions) {
    super(FIGWidgetType.window, false);
    this.label = options?.label ?? 'Window';
    this.size = options?.size ?? {width: 320, height: 240};
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
    ImGui.SetNextWindowSize(new ImGui.Vec2(this.size.width, this.size.height));
    ImGui.Begin(this.label);
    for (const child of this.children) {
      child.draw();
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
