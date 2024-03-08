import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size} from "./math";

export class FIGWindowWidget extends FIGContainer {
  title: string;
  size: Size;

  constructor(title: string = 'Window', size: Size = {width: 320, height: 240}) {
    super(FIGWidgetType.window, 'window');
    this.title = title;
    this.size = size;
  }

  public get name(): string {
    return this.title;
  }

  public override draw(): void {
    ImGui.SetNextWindowSize(new ImGui.Vec2(this.size.width, this.size.height));
    ImGui.Begin(this.title);
    for (const child of this.children) {
      child.draw();
    }
    const size = ImGui.GetWindowSize();
    let update = false;

    if (this.size.width !== size.x) {
      this.size.width = size.x;
      update = true;
    }
    if (this.size.height !== size.y) {
      this.size.height = size.y;
      update = true;
    }
    ImGui.End();
    if (update) {
      this.updateSubject.next();
    }
  }
}
