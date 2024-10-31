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

  label: string = 'ListBox';
  items: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  itemsSize: number = 4;

  selectedItem: number = 0;

  constructor(options?: FIGListBoxOptions) {
    super(FIGWidgetType.listbox, true);
    this.registerString('label', 'Label', options?.label ?? 'ListBox');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerArray('items', 'List of items', options?.items, true, ['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    this.registerInteger('itemsSize', 'Height in items', options?.itemsSize, true, 4);
    //this.registerInteger('selectedItem', 'Selected item', 0, true, 0);
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
