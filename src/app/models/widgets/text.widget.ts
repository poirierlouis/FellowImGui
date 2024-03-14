import {FIGWidgetType} from "./widget";
import {Color} from "../math";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGTextWidget extends FIGWithTooltip {
  text: string;
  color?: Color;
  isDisabled: boolean = false;
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
    if (this.isDisabled) {
      ImGui.TextDisabled(this.text);
    } else if (this.color) {
      ImGui.TextColored(new ImGui.Vec4(this.color.r, this.color.g, this.color.b, this.color.a), this.text);
    } else {
      ImGui.Text(this.text);
    }
    super.draw();
  }
}
