import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGButtonWidget extends FIGWithTooltip {
  text: string;

  constructor(text: string = 'Button', tooltip?: string) {
    super(FIGWidgetType.button, true);
    this.text = text;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    ImGui.Button(this.text);
    super.draw();
  }
}
