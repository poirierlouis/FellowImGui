import {FIGWidget} from "./widget";

export abstract class FIGWithTooltip extends FIGWidget {

  public tooltip?: string;

  protected drawTooltip(): void {
    if (this.tooltip && ImGui.IsItemHovered()) {
      ImGui.SetTooltip(this.tooltip);
    }
  }

}
