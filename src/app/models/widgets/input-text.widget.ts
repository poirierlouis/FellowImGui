import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {getEnumValues} from "../enum";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGInputTextFlags {
  CharsDecimal = 1,
  CharsHexadecimal = 2,
  CharsUppercase = 4,
  CharsNoBlank = 8,
  AutoSelectAll = 16,
  EnterReturnsTrue = 32,
  CallbackCompletion = 64,
  CallbackHistory = 128,
  CallbackAlways = 256,
  CallbackCharFilter = 512,
  AllowTabInput = 1024,
  CtrlEnterForNewLine = 2048,
  NoHorizontalScroll = 4096,
  AlwaysOverwrite = 8192,
  ReadOnly = 16384,
  Password = 32768,
  NoUndoRedo = 65536,
  CharsScientific = 131072,
  CallbackResize = 262144,
  CallbackEdit = 524288,
  EscapeClearsAll = 1048576
}

export interface FIGInputTextOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
  readonly hint?: string;
  readonly bufferSize?: number;
  readonly flags?: FIGInputTextFlags;
}

export class FIGInputTextWidget extends FIGWithTooltip {
  public static readonly flags: FIGInputTextFlags[] = getEnumValues(FIGInputTextFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'value', optional: true, default: ''},
    {name: 'hint', optional: true, default: undefined},
    {name: 'tooltip', optional: true, default: undefined},
    {name: 'bufferSize', optional: true, default: 256},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string;
  value: string;
  hint?: string;
  bufferSize: number;
  flags: number;

  constructor(options?: FIGInputTextOptions) {
    super(FIGWidgetType.inputText, true);
    this.label = options?.label ?? 'Text';
    this.value = options?.value ?? '';
    this.hint = options?.hint;
    this.tooltip = options?.tooltip;
    this.bufferSize = options?.bufferSize ?? 256;
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const access = (_ = this.value) => this.value = _;
    const prevValue = this.value;

    if (!this.hint) {
      ImGui.InputText(this.label, access, this.bufferSize, this.flags);
    } else {
      ImGui.InputTextWithHint(this.label, this.hint, access, this.bufferSize, this.flags);
    }
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevValue !== this.value) {
      this.triggerUpdate();
    }
  }
}
