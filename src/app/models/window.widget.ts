import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";

export class FIGWindowWidget extends FIGContainer {
  title: string;

  constructor(title: string = 'Window') {
    super(FIGWidgetType.window, 'window');
    this.title = title;
  }

  public get name(): string {
    return this.title;
  }

  public override render(): void {
    ImGui.Begin(this.title);
    for (const child of this.children) {
      child.render();
    }
    ImGui.End();
  }
}
