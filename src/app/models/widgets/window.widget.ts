import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size} from "../math";

export class FIGWindowWidget extends FIGContainer {
  title: string;
  size: Size;

  constructor(title: string = 'Window', size: Size = {width: 320, height: 240}) {
    super(FIGWidgetType.window, false, 'window');
    this.title = title;
    this.size = size;
  }

  public get name(): string {
    return this.title;
  }

  public override draw(): void {
    if (this.isFocused) {
      ImGui.SetNextWindowFocus();
    }
    ImGui.SetNextWindowSize(new ImGui.Vec2(this.size.width, this.size.height));
    ImGui.Begin(this.title);
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
    this.updateSubject.next();
  }
}
