import {FIGWidgetType} from "./widget";
import {Color} from "../math";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGTextWidget extends FIGWithTooltip {
  text: string;
  color?: Color;
  isDisabled: boolean = false;
  isWrapped: boolean = false;
  hasBullet: boolean = false;

  constructor(text: string = 'Text', tooltip?: string) {
    super(FIGWidgetType.text, true);
    this.text = text;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    if (this.isDisabled) {
      ImGui.BeginDisabled(true);
    } else if (this.color) {
      ImGui.PushStyleColor(0, new ImGui.Vec4(this.color.r, this.color.g, this.color.b, this.color.a));
    }
    if (this.hasBullet) {
      ImGui.Bullet();
      this.growFocusRect();
    }
    if (this.isWrapped) {
      ImGui.TextWrapped(this.text);
    } else {
      ImGui.Text(this.text);
    }
    if (this.isDisabled) {
      ImGui.EndDisabled();
    } else if (this.color) {
      ImGui.PopStyleColor();
    }
    super.draw();
  }
}
