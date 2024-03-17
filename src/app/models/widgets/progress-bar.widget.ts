import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";

export class FIGProgressBarWidget extends FIGWithTooltip {
  value: number;
  label?: string;
  isFill: boolean;

  constructor(value: number = 0.0,
              label?: string,
              tooltip?: string) {
    super(FIGWidgetType.progressBar, true);
    this.value = value;
    this.label = label;
    this.isFill = false;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.label ?? `${(this.value * 100).toFixed(0)} %`;
  }

  public override draw(): void {
    const progression: string = `${(this.value * 100.0).toFixed(0)}%`;
    const size: Vector2 = {x: 0, y: 0};

    if (this.isFill) {
      size.x = -1;
    }
    ImGui.ProgressBar(this.value, size, progression);
    this.growFocusRect();
    let showTooltip: boolean = ImGui.IsItemHovered();

    if (this.label && !this.isFill) {
      ImGui.SameLine(0.0, ImGui.GetStyle().ItemInnerSpacing.x);
      ImGui.Text(this.label);
      showTooltip ||= ImGui.IsItemHovered();
    }
    if (this.tooltip && showTooltip) {
      ImGui.SetTooltip(this.tooltip);
    }
    super.drawFocus();
  }
}