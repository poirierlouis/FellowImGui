import {FIGWidget} from "./widget";

export abstract class FIGWithTooltip extends FIGWidget {

  public tooltip?: string;

  public override draw() {
    if (this.tooltip && ImGui.IsItemHovered()) {
      ImGui.SetTooltip(this.tooltip);
    }
    super.draw();
  }

}
