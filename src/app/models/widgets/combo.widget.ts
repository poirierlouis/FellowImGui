import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGComboOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly items?: string[];
}

export class FIGComboWidget extends FIGWithTooltip {
  label: string;
  readonly items: string[];

  selectedIndex: number;

  constructor(options?: FIGComboOptions) {
    super(FIGWidgetType.combo, true);
    this.label = options?.label ?? 'Combo';
    this.items = options?.items ?? [];
    this.selectedIndex = 0;
    this.tooltip = options?.tooltip;
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
