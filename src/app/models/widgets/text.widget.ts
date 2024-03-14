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
    if (this.hasBullet) {
      ImGui.Bullet();
    }
    let color: any;

    if (this.isDisabled) {
      color = ImGui.GetStyleColorVec4(1);
    } else if (this.color) {
      color = new ImGui.Vec4(this.color.r, this.color.g, this.color.b, this.color.a);
    }
    if (color) {
      ImGui.PushStyleColor(0, color);
    }
    if (this.isWrapped) {
      ImGui.TextWrapped(this.text);
    } else {
      ImGui.Text(this.text);
    }
    if (color) {
      ImGui.PopStyleColor();
    }
    super.draw();
  }
}
