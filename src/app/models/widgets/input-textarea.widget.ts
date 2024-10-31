import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGInputTextFlags, FIGInputTextFlagsOptions} from "./input-text.widget";
import {Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGInputTextareaOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
  readonly linesSize?: number;
  readonly bufferSize?: number;
  readonly flags?: FIGInputTextFlags;
}

export class FIGInputTextareaWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'value', optional: true, default: ''},
    {name: 'tooltip', optional: true, default: undefined},
    {name: 'linesSize', optional: true, default: 6},
    {name: 'bufferSize', optional: true, default: 256},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string = '##InputTextMultiline';
  value: string = '';
  linesSize: number = 6;
  bufferSize: number = 256;
  flags: number = 0;

  constructor(options?: FIGInputTextareaOptions) {
    super(FIGWidgetType.inputTextarea, true);
    this.registerString('label', 'Label', options?.label ?? '##InputTextMultiline');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerString('value', 'Value', options?.value, true, '');
    this.registerInteger('linesSize', 'Height in lines', options?.linesSize, true, 6);
    this.registerInteger('bufferSize', 'Buffer size', options?.bufferSize, true, 256);
    this.registerFlags('flags', 'Flags', FIGInputTextFlagsOptions, options?.flags, true, 0);
    this.bufferSize = Math.max(this.value.length, this.bufferSize);
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override draw(): void {
    const access = (_ = this.value) => this.value = _;
    const prevValue = this.value;
    const size: Vector2 = {x: -1, y: ImGui.GetTextLineHeight() * this.linesSize};

    ImGui.InputTextMultiline(this.label, access, this.bufferSize, size, this.flags);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevValue !== this.value) {
      this.bufferSize = Math.max(this.value.length, this.bufferSize);
      this.triggerUpdate();
    }
  }
}
