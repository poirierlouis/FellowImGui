import {FIGWidgetType} from "./widget";
import {Color} from "../math";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGTextOptions extends FIGTooltipOption {
  readonly text?: string;
  readonly color?: Color;
  readonly isDisabled?: boolean;
  readonly isWrapped?: boolean;
  readonly hasBullet?: boolean;
}

export class FIGTextWidget extends FIGWithTooltip {
  text: string;
  color?: Color;
  isDisabled: boolean;
  isWrapped: boolean;
  hasBullet: boolean;

  constructor(options?: FIGTextOptions) {
    super(FIGWidgetType.text, true);
    this.text = options?.text ?? 'Text';
    this.color = options?.color;
    this.isDisabled = options?.isDisabled ?? false;
    this.isWrapped = options?.isWrapped ?? false;
    this.hasBullet = options?.hasBullet ?? false;
    this.tooltip = options?.tooltip;
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
    super.drawTooltip();
    super.drawFocus();
  }
}
