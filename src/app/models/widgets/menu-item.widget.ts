import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGMenuItemOptions {
  readonly label?: string;
  readonly shortcut?: string;
  readonly isSelectable?: boolean;
  readonly isSelected?: boolean;
  readonly enabled?: boolean;
}

export class FIGMenuItemWidget extends FIGWidget {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'shortcut', optional: true, default: undefined},
    {name: 'isSelectable', optional: true, default: false},
    {name: 'isSelected', optional: true, default: false},
    {name: 'enabled', optional: true, default: true}
  ];

  label: string = 'MenuItem';
  shortcut?: string;
  isSelectable: boolean = false;
  isSelected: boolean = false;
  enabled: boolean = true;

  constructor(options?: FIGMenuItemOptions) {
    super(FIGWidgetType.menuItem, true);
    this.registerString('label', 'Label', options?.label ?? 'MenuItem');
    this.registerString('shortcut', 'Shortcut', options?.shortcut, true);
    this.registerBool('enabled', 'Enabled', options?.enabled, true, true);
    this.registerBool('isSelectable', 'Is selectable', options?.isSelectable, true, false);
    this.registerBool('isSelected', 'Is selected', options?.isSelected, true, false);
    this._focusOffset.x = 0;
    this._focusOffset.y = 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const args: any[] = [this.label];
    const prevSelected: boolean = this.isSelected;

    if (this.shortcut || this.isSelectable || !this.enabled) {
      args.push(this.shortcut ?? '');
    }
    if (this.isSelectable || !this.enabled) {
      args.push(this.isSelectable ? (_ = this.isSelected) => this.isSelected = _ : () => false);
    }
    if (!this.enabled) {
      args.push(false);
    }
    ImGui.MenuItem(...args);
    this.drawFocus();
    if (prevSelected !== this.isSelected) {
      this.triggerUpdate();
    }
  }
}
