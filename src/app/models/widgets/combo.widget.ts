import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGComboOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly items?: string[];
}

export class FIGComboWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'items', optional: true, default: []},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  label: string = 'Combo';
  items: string[] = [];

  selectedItem: number = 0;

  constructor(options?: FIGComboOptions) {
    super(FIGWidgetType.combo, true);
    this.registerString('label', 'Label', options?.label ?? 'Combo');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerArray('items', 'List of items', options?.items, true, []);
    this.registerInteger('selectedItem', 'Selected item', 0, true, 0);
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const prevSelectedItem: number = this.selectedItem;

    ImGui.Combo(
      this.label,
      (_ = this.selectedItem) => this.selectedItem = _,
      this.items,
      this.items.length
    );
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevSelectedItem !== this.selectedItem) {
      this.triggerUpdate();
    }
  }
}
