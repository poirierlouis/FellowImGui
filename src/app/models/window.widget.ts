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
    ImGui.SetNextWindowSize({x: this.size.width, y: this.size.height});
    ImGui.Begin(this.title);
    for (const child of this.children) {
      child.draw();
    }
    ImGui.End();
  }
}
