import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGComboWidget extends FIGWithTooltip {
  label: string;
  readonly items: string[];

  selectedIndex: number;

  constructor(label: string = 'Combo', items: string[] = [], tooltip?: string) {
    super(FIGWidgetType.combo, true);
    this.label = label;
    this.items = items;
    this.selectedIndex = 0;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    ImGui.Combo(
      this.label,
      (_ = this.selectedIndex) => this.selectedIndex = _,
      this.items,
      this.items.length
    );
    super.drawTooltip();
    super.drawFocus();
  }
}
