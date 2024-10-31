import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Size, Vector2} from "../math";
import {getEnumValues} from "../enum";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FlagOption, getOptions} from "../fields/flags.field";

export enum FIGSelectableFlags {
  DontClosePopups = 1,
  SpanAllColumns = 2,
  AllowDoubleClick = 4,
  Disabled = 8,
  AllowOverlap = 16
}

export const FIGSelectableFlagsOptions: FlagOption[] = getOptions(FIGSelectableFlags);

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

  text: string = 'Text';
  flags: number = 0;
  selected: boolean = false;
  size: Size = {width: 0, height: 0};

  constructor(options?: FIGSelectableOptions) {
    super(FIGWidgetType.selectable, true);
    this.registerString('text', 'Label', options?.text ?? 'Text');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerFlags('flags', 'Flags', FIGSelectableFlagsOptions, options?.flags, true, 0);
    this.registerBool('selected', 'Is selected', options?.selected, true, false);
    this.registerSize('size', 'Size', false, options?.size, true, {width: 0, height: 0});
    this._focusOffset.x = 0;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const access = (_ = this.selected) => this.selected = _;
    const size: Vector2 | undefined = {x: this.size.width, y: this.size.height};

    ImGui.Selectable(this.text, access, this.flags, size);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }
}
