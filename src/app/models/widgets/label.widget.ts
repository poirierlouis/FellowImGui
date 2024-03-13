import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGLabelWidget extends FIGWithTooltip {
  label: string;
  value: string;

  constructor(label: string = 'Label', value: string = 'Value', tooltip?: string) {
    super(FIGWidgetType.label, true, 'label');
    this.label = label;
    this.value = value;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return `${this.value} ${this.label}`;
  }

  public override draw(): void {
    ImGui.LabelText(this.label, this.value);
    super.draw();
  }
}
