import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGLabelOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
}

export class FIGLabelWidget extends FIGWithTooltip {
  label: string;
  value: string;

  constructor(options?: FIGLabelOptions) {
    super(FIGWidgetType.label, true);
    this.label = options?.label ?? 'Label';
    this.value = options?.value ?? 'Value';
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return `${this.value} ${this.label}`;
  }

  public override draw(): void {
    ImGui.LabelText(this.label, this.value);
    super.drawTooltip();
    super.drawFocus();
  }
}
