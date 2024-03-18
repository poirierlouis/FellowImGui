import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGCheckboxOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly isChecked?: boolean;
}

export class FIGCheckboxWidget extends FIGWithTooltip {
  label: string;
  isChecked: boolean = false;

  constructor(options?: FIGCheckboxOptions) {
    super(FIGWidgetType.checkbox, true);
    this.label = options?.label ?? 'Checkbox';
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const prevIsChecked: boolean = this.isChecked;

    ImGui.Checkbox(this.label, (_ = this.isChecked) => this.isChecked = _);
    super.drawTooltip();
    super.drawFocus();
    if (prevIsChecked !== this.isChecked) {
      this.updateSubject.next();
    }
  }
}
