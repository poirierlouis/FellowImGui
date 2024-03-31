import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Size, Vector2} from "../math";
import {getEnumValues} from "../enum";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGSelectableFlags {
  DontClosePopups = 1,
  SpanAllColumns = 2,
  AllowDoubleClick = 4,
  Disabled = 8,
  AllowOverlap = 16
}

export interface FIGSelectableOptions extends FIGTooltipOption {
  readonly text?: string;
  readonly selected?: boolean;
  readonly flags?: number;
  readonly size?: Size;
}

export class FIGSelectableWidget extends FIGWithTooltip {
  public static readonly flags: FIGSelectableFlags[] = getEnumValues(FIGSelectableFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'text'},
    {name: 'selected', optional: true, default: false},
    {name: 'flags', optional: true, default: 0},
    {
      name: 'size', type: 'object', innerType: [
        {name: 'width'},
        {name: 'height'}
      ]
    },
    {name: 'tooltip', optional: true, default: undefined}
  ];

  text: string;
  selected: boolean;
  flags: number;
  size: Size;

  constructor(options?: FIGSelectableOptions) {
    super(FIGWidgetType.selectable, true);
    this.text = options?.text ?? 'Text';
    this.selected = options?.selected ?? false;
    this.flags = options?.flags ?? 0;
    this.size = options?.size ?? {width: 0, height: 0};
    this.tooltip = options?.tooltip;
    this._focusOffset.x = 0;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const size: Vector2 = {x: this.size.width, y: this.size.height};
    const prevSelected: boolean = this.selected;

    ImGui.Selectable(this.text, (_ = this.selected) => this.selected = _, this.flags, size);
    if (prevSelected !== this.selected) {
      this.triggerUpdate();
    }
    super.drawTooltip();
    super.drawFocus();
  }
}
