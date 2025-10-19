import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {getPrecision} from "../string";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {EnumOption} from "../fields/enum.field";
import {getOptions} from "../fields/flags.field";

export enum FIGSliderType {
  slider,
  drag
}

export enum FIGSliderDataType {
  int,
  int2,
  int3,
  int4,

  float,
  float2,
  float3,
  float4
}

export const FIGSliderTypeOptions: EnumOption[] = [
  {value: FIGSliderType.slider, label: 'Slider'},
  {value: FIGSliderType.drag, label: 'Drag'}
];
export const FIGSliderDataTypeOptions: EnumOption[] = getOptions(FIGSliderDataType);

export interface FIGSliderOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: number[];
  readonly valueSpeed?: number;
  readonly valueMin?: number;
  readonly valueMax?: number;
  readonly format?: string;
  readonly power?: number;
  readonly sliderType?: FIGSliderType;
  readonly dataType?: FIGSliderDataType;
}

export class FIGSliderWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'sliderType', optional: true, default: FIGSliderType.slider},
    {name: 'dataType'},
    {name: 'value'},
    {name: 'valueSpeed', optional: true, default: 0.01},
    {name: 'valueMin'},
    {name: 'valueMax'},
    {name: 'format'},
    {name: 'power', optional: true, default: 0},
    {name: 'tooltip', optional: true, default: undefined}
  ];
  label: string = 'Slider';
  sliderType: FIGSliderType = FIGSliderType.slider;
  dataType: FIGSliderDataType = FIGSliderDataType.int;
  value: number[] = [0, 0, 0, 0];
  valueSpeed: number = 0.01;
  valueMin: number = 0;
  valueMax: number = 100;
  format: string = '%d';
  power: number = 0;

  constructor(options?: FIGSliderOptions) {
    super(FIGWidgetType.slider, true);
    this.registerString('label', 'Label', options?.label ?? 'Slider / Drag');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerEnum('sliderType', 'Type', FIGSliderTypeOptions, options?.sliderType, true, FIGSliderType.slider);
    this.registerEnum('dataType', 'Data Type', FIGSliderDataTypeOptions, options?.dataType, true, FIGSliderDataType.int);
    // TODO: temporary fix
    let value: number | number[] | undefined = options?.value;

    if (!Array.isArray(value)) {
      value = [value ?? 0, 0, 0, 0];
    }
    this.registerNumber4('value', 'Value', value, true, [0, 0, 0, 0]);
    this.registerFloat('valueSpeed', 'Value speed', options?.valueSpeed, true, 0.01);

    const isInteger: boolean = FIGSliderWidget.isInteger(this.dataType);
    this.registerFloat('valueMin', 'Minimum', options?.valueMin, true, (isInteger ? 0 : 0.01));
    this.registerFloat('valueMax', 'Maximum', options?.valueMax, true, (isInteger ? 100 : 1.00));

    this.registerString('format', 'Format', options?.format, true, (isInteger ? '%d' : '%.2f'));
    this.registerInteger('power', 'Power', options?.power, true, 0);
  }

  public get name(): string {
    return this.label;
  }

  public static isInteger(dataType: FIGSliderDataType): boolean {
    return dataType >= FIGSliderDataType.int && dataType <= FIGSliderDataType.int4;
  }

  public static isFloat(dataType: FIGSliderDataType): boolean {
    return dataType >= FIGSliderDataType.float && dataType <= FIGSliderDataType.float4;
  }

  public static getArraySize(dataType: FIGSliderDataType): number {
    if (dataType === FIGSliderDataType.int2 || dataType === FIGSliderDataType.float2) {
      return 2;
    } else if (dataType === FIGSliderDataType.int3 || dataType === FIGSliderDataType.float3) {
      return 3;
    } else if (dataType === FIGSliderDataType.int4 || dataType === FIGSliderDataType.float4) {
      return 4;
    }
    return 1;
  }

  public static getPrecision(widget: FIGSliderWidget): number | undefined {
    if (this.isInteger(widget.dataType) || widget.format === undefined) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public static roundValues(values: number[], precision: number): void {
    for (let i: number = 0; i < values.length; i++) {
      const round: number = Math.pow(10, precision);

      values[i] = Math.round(values[i] * round) / round;
    }
  }

  public static resize(self: FIGSliderWidget): number[] {
    const size: number = FIGSliderWidget.getArraySize(self.dataType);

    if (size === 1) {
      return [self.value[0]];
    } else if (size === 2) {
      return [self.value[0], self.value[1]];
    } else if (size === 3) {
      return [self.value[0], self.value[1], self.value[2]];
    }
    return [self.value[0], self.value[1], self.value[2], self.value[3]];
  }

  private static readonly drawers = {
    [FIGSliderType.slider]: {
      [FIGSliderDataType.int]: ImGui.SliderInt,
      [FIGSliderDataType.int2]: ImGui.SliderInt2,
      [FIGSliderDataType.int3]: ImGui.SliderInt3,
      [FIGSliderDataType.int4]: ImGui.SliderInt4,
      [FIGSliderDataType.float]: ImGui.SliderFloat,
      [FIGSliderDataType.float2]: ImGui.SliderFloat2,
      [FIGSliderDataType.float3]: ImGui.SliderFloat3,
      [FIGSliderDataType.float4]: ImGui.SliderFloat4
    },
    [FIGSliderType.drag]: {
      [FIGSliderDataType.int]: ImGui.DragInt,
      [FIGSliderDataType.int2]: ImGui.DragInt2,
      [FIGSliderDataType.int3]: ImGui.DragInt3,
      [FIGSliderDataType.int4]: ImGui.DragInt4,
      [FIGSliderDataType.float]: ImGui.DragFloat,
      [FIGSliderDataType.float2]: ImGui.DragFloat2,
      [FIGSliderDataType.float3]: ImGui.DragFloat3,
      [FIGSliderDataType.float4]: ImGui.DragFloat4
    }
  };

  public override draw(): void {
    const values: number[] = FIGSliderWidget.resize(this);

    const fn: (...args: any[]) => void = FIGSliderWidget.drawers[this.sliderType][this.dataType];
    const args: any[] = [];

    args.push(this.label);
    if (FIGSliderWidget.getArraySize(this.dataType) === 1) {
      args.push((_ = values[0]) => values[0] = _);
    } else {
      args.push(values);
    }
    if (this.sliderType === FIGSliderType.drag) {
      args.push(this.valueSpeed);
    }
    args.push(this.valueMin, this.valueMax, this.format);
    if (FIGSliderWidget.isFloat(this.dataType)) {
      args.push(this.power);
    }
    fn(...args);

    while (values.length < 4) {
      values.push(0);
    }
    if (FIGSliderWidget.isFloat(this.dataType)) {
      FIGSliderWidget.roundValues(values, getPrecision(this.format) ?? 1);
    }
    this.value = values;
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }

}
