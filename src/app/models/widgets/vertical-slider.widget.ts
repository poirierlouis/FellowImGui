import type {FIGSerializeProperty} from "../../parsers/document.parser";
import type {EnumOption} from "../fields/enum.field";
import {getOptions} from "../fields/flags.field";
import type {SizeField} from "../fields/size.field";
import type {Size, Vector2} from "../math";
import {getPrecision} from "../string";
import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWidgetHelper} from "./widget.helper";

export enum FIGVerticalSliderType {
  int,
  float,
}

export interface FIGVerticalSliderOptions {
  readonly dataType?: FIGVerticalSliderType;
  readonly label?: string;
  readonly size?: Size;
  readonly value?: number;
  readonly valueMin?: number;
  readonly valueMax?: number;
  readonly format?: string;
  readonly power?: number;
  readonly tooltip?: boolean;
}

export const FIGVerticalSliderTypeOptions: EnumOption[] = getOptions(FIGVerticalSliderType);

export class FIGVerticalSliderWidget extends FIGWidget {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "dataType"},
    {name: "label"},
    {name: "size", type: "object", innerType: [{name: "width"}, {name: "height"}]},
    {name: "value", optional: true, default: 0},
    {name: "valueMin"},
    {name: "valueMax"},
    {name: "format"},
    {name: "power", optional: true, default: 0},
    {name: "tooltip", optional: true, default: true},
  ];

  label: string = "##VSlider";
  tooltip: boolean = true;
  size: Size = {width: 24, height: 128};
  dataType: FIGVerticalSliderType = FIGVerticalSliderType.int;
  value: number = 0;
  valueMin: number = 0;
  valueMax: number = 100;
  format: string = "%d";
  power: number = 0;

  constructor(options?: FIGVerticalSliderOptions) {
    super(FIGWidgetType.verticalSlider, true);
    this.registerString("label", "Label", options?.label, true, "##VSlider");
    this.registerBool("tooltip", "Tooltip", options?.tooltip, true);
    this.registerSize("size", "Size", true, options?.size, true, {width: 24, height: 128});
    this.registerEnum(
      "dataType",
      "Data Type",
      FIGVerticalSliderTypeOptions,
      options?.dataType,
      true,
      FIGVerticalSliderType.int,
    );

    const isInteger: boolean = FIGVerticalSliderWidget.isInteger(this.dataType);
    this.registerFloat("value", "Value", options?.value, true, 0);
    this.registerFloat("valueMin", "Minimum", options?.valueMin, true, isInteger ? 0 : 0.0);
    this.registerFloat("valueMax", "Maximum", options?.valueMax, true, isInteger ? 5 : 1.0);

    this.registerString("format", "Format", options?.format, true, isInteger ? "%d" : "%.2f");
    this.registerInteger("power", "Power", options?.power, true, 0);
  }

  public static isInteger(dataType: FIGVerticalSliderType): boolean {
    return dataType === FIGVerticalSliderType.int;
  }

  public static isFloat(dataType: FIGVerticalSliderType): boolean {
    return dataType === FIGVerticalSliderType.float;
  }

  public static getPrecision(widget: FIGVerticalSliderWidget): number | undefined {
    if (FIGVerticalSliderWidget.isInteger(widget.dataType) || widget.format === undefined) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override draw(): void {
    const size: Vector2 | undefined = FIGWidgetHelper.computeSize(this.getField("size") as SizeField);
    const ref = {value: this.value};
    const access = (_ = ref.value) => (ref.value = _);
    const format: string = this.tooltip ? "" : this.format;
    const isInteger = this.dataType === FIGVerticalSliderType.int;

    if (isInteger) {
      ImGui.VSliderInt(this.label, size, access, this.valueMin, this.valueMax, format);
    } else {
      ImGui.VSliderFloat(this.label, size, access, this.valueMin, this.valueMax, format, this.power);
    }

    if (this.tooltip && (ImGui.IsItemActive() || ImGui.IsItemHovered())) {
      const precision: number | undefined = getPrecision(this.format);

      if (precision === undefined) {
        ImGui.SetTooltip(ref.value.toString());
      } else {
        ImGui.SetTooltip(ref.value.toFixed(precision));
      }
    }

    if (isInteger) {
      this.value = Math.trunc(ref.value);
    } else {
      const precision: number = getPrecision(this.format) ?? 2;
      const round: number = 10 ** precision;
      this.value = Math.round(ref.value * round) / round;
    }

    this.drawFocus();
    this.scrollTo();
  }
}
