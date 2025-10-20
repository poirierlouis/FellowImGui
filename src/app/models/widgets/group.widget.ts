import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";

export class FIGGroupWidget extends FIGContainer {
  constructor() {
    super(FIGWidgetType.group, true);
  }

  public readonly name = "Group";

  public override draw(): void {
    ImGui.BeginGroup();
    for (const child of this.children) {
      child.draw();
      child.listen();
    }
    ImGui.EndGroup();
    this.drawFocus();
    this.scrollTo();
  }
}
