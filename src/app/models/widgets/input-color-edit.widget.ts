import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Color} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {getEnumValues} from "../enum";

export enum FIGInputColorEditFlags {
  NoAlpha              = 2,
  NoPicker             = 4,
  NoOptions            = 8,
  NoSmallPreview       = 16,
  NoInputs             = 32,
  NoTooltip            = 64,
  NoLabel              = 128,
  NoSidePreview        = 256,
  NoDragDrop           = 512,
  NoBorder             = 1024,
  AlphaBar             = 65536,
  AlphaPreview         = 131072,
  AlphaPreviewHalf     = 262144,
  HDR                  = 524288,
  DisplayRGB           = 1048576,
  DisplayHSV           = 2097152,
  Float                = 16777216,
  PickerHueBar         = 33554432,
  PickerHueWheel       = 67108864,
  InputRGB             = 134217728,
  InputHSV             = 268435456
}

export enum FIGInputColorEditMasks {
  DisplayMask_         = 7340032,
  DataTypeMask_        = 25165824,
  PickerMask_          = 100663296,
  DefaultOptions_      = 177209344,
  InputMask_           = 402653184
}

export interface FIGInputColorEditOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly color?: Color;
  readonly withAlpha?: boolean;
  readonly flags?: number;
}

export class FIGInputColorEditWidget extends FIGWithTooltip {
  public static readonly flags: FIGInputColorEditFlags[] = getEnumValues(FIGInputColorEditFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'color', type: 'object', innerType: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a'}]},
    {name: 'withAlpha', optional: true, default: false},
    {name: 'tooltip', optional: true, default: undefined},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string;
  color: Color;
  withAlpha: boolean;
  flags: number;

  constructor(options?: FIGInputColorEditOptions) {
    super(FIGWidgetType.inputColorEdit, true);
    this.label = options?.label ?? 'Input Color Edit';
    this.color = options?.color ?? {r: 0.5, g: 0.5, b: 0.5, a: 0.5};
    this.withAlpha = options?.withAlpha ?? false;
    this.tooltip = options?.tooltip;
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const values: number[] = [this.color.r, this.color.g, this.color.b, this.color.a];
    const prevValues: number[] = [...values];

    if (!this.withAlpha) {
      ImGui.ColorEdit3(this.label, values, this.flags);
    } else {
      ImGui.ColorEdit4(this.label, values, this.flags);
    }
    if (this.diffColor(prevValues, values)) {
      this.color.r = values[0];
      this.color.g = values[1];
      this.color.b = values[2];
      this.color.a = values[3];
      this.triggerUpdate();
    }
    this.drawTooltip();
    this.drawFocus();
  }

  private diffColor(prevColor: number[], color: number[]): boolean {
    for (let i = 0; i < 4; i++) {
      if (prevColor[i] !== color[i]) {
        return true;
      }
    }
    return false;
  }
}
