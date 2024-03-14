import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGCheckboxWidget extends FIGWithTooltip {
  text: string;

  isChecked: boolean = false;

  constructor(text: string = 'Checkbox', tooltip?: string) {
    super(FIGWidgetType.checkbox, true);
    this.text = text;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const prevIsChecked: boolean = this.isChecked;

    ImGui.Checkbox(this.text, (_ = this.isChecked) => this.isChecked = _);
    super.draw();
    if (prevIsChecked !== this.isChecked) {
      this.updateSubject.next();
    }
  }
}
