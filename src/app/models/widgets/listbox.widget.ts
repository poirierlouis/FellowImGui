import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGListBoxOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly items?: string[];
  readonly itemsSize?: number;
}

export class FIGListBoxWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'items'},
    {name: 'itemsSize', optional: true, default: 4},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  label: string;
  readonly items: string[];
  itemsSize: number;

  selectedItem: number;

  constructor(options?: FIGListBoxOptions) {
    super(FIGWidgetType.listbox, true);
    this.label = options?.label ?? 'ListBox';
    this.items = options?.items ?? ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    this.itemsSize = options?.itemsSize ?? 4;
    this.selectedItem = 0;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const prevSelectedItem = this.selectedItem;

    ImGui.ListBox(
      this.label,
      (_ = this.selectedItem) => this.selectedItem = _,
      this.items,
      this.items.length,
      this.itemsSize
    );
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevSelectedItem !== this.selectedItem) {
      this.triggerUpdate();
    }
  }
}
