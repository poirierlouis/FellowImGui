import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGCheckboxOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly isChecked?: boolean;
}

export class FIGCheckboxWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'isChecked', optional: true, default: false},
    {name: 'tooltip', optional: true, default: undefined},
  ];

  label: string;
  isChecked: boolean;

  constructor(options?: FIGCheckboxOptions) {
    super(FIGWidgetType.checkbox, true);
    this.label = options?.label ?? 'Checkbox';
    this.isChecked = options?.isChecked ?? false;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const prevIsChecked: boolean = this.isChecked;

    ImGui.Checkbox(this.label, (_ = this.isChecked) => this.isChecked = _);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevIsChecked !== this.isChecked) {
      this.triggerUpdate();
    }
  }

}
