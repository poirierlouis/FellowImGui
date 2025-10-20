import type {FIGSerializeProperty} from "../../parsers/document.parser";
import {type EnumOption, EnumOptionDivider} from "../fields/enum.field";
import {getPrecision} from "../string";
import {FIGWidgetType} from "./widget";
import {type FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export enum FIGInputNumberType {
  int,
  int2,
  int3,
  int4,

  float,
  float2,
  float3,
  float4,

  double,
}

export const FIGInputNumberTypeOptions: EnumOption[] = [
  {value: FIGInputNumberType.int, label: "Int"},
  {value: FIGInputNumberType.int2, label: "Int2"},
  {value: FIGInputNumberType.int3, label: "Int3"},
  {value: FIGInputNumberType.int4, label: "Int4"},
  EnumOptionDivider(-1),
  {value: FIGInputNumberType.float, label: "Float"},
  {value: FIGInputNumberType.float2, label: "Float2"},
  {value: FIGInputNumberType.float3, label: "Float3"},
  {value: FIGInputNumberType.float4, label: "Float4"},
  EnumOptionDivider(-2),
  {value: FIGInputNumberType.double, label: "Double"},
];

export interface FIGInputNumberOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: number[];
  readonly step?: number;
  readonly stepFast?: number;
  readonly format?: string;
  readonly dataType?: FIGInputNumberType;
}

export class FIGInputNumberWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "label"},
    {name: "dataType"},
    {name: "value", optional: true, default: 0},
    {name: "step"},
    {name: "stepFast"},
    {name: "format"},
    {name: "tooltip", optional: true, default: undefined},
  ];

  private static readonly drawers = {
    [FIGInputNumberType.int]: ImGui.InputInt,
    [FIGInputNumberType.int2]: ImGui.InputInt2,
    [FIGInputNumberType.int3]: ImGui.InputInt3,
    [FIGInputNumberType.int4]: ImGui.InputInt4,

    [FIGInputNumberType.float]: ImGui.InputFloat,
    [FIGInputNumberType.float2]: ImGui.InputFloat2,
    [FIGInputNumberType.float3]: ImGui.InputFloat3,
    [FIGInputNumberType.float4]: ImGui.InputFloat4,

    [FIGInputNumberType.double]: ImGui.InputDouble,
  };

  label: string = "Input Number";
  dataType: FIGInputNumberType = FIGInputNumberType.int;
  value: number[] = [0, 0, 0, 0];
  step: number = 1;
  stepFast: number = 10;
  format: string = "%.3f";

  constructor(options?: FIGInputNumberOptions) {
    super(FIGWidgetType.inputNumber, true);
    this.registerString("label", "Label", options?.label ?? "Input Number");
    this.registerString("tooltip", "Tooltip", options?.tooltip, true);
    this.registerEnum(
      "dataType",
      "Data type",
      FIGInputNumberTypeOptions,
      options?.dataType,
      true,
      FIGInputNumberType.int,
    );
    this.registerNumber4("value", "Value", options?.value, true, [0, 0, 0, 0]);

    let defaultFormat: string = "%d";
    let defaultStep: number = 1;
    let defaultStepFast: number = 10;
    if (this.dataType === FIGInputNumberType.int) {
      defaultFormat = "%.3f";
      defaultStep = 0.001;
      defaultStepFast = 0.01;
    } else if (this.dataType === FIGInputNumberType.double) {
      defaultFormat = "%.8f";
      defaultStep = 0.00000001;
      defaultStepFast = 0.0000001;
    }
    this.registerNumber("step", "Step", options?.step, true, defaultStep);
    this.registerNumber("stepFast", "Step fast", options?.stepFast, true, defaultStepFast);
    this.registerString("format", "Format", options?.format, true, defaultFormat);
  }

  public get name(): string {
    return this.label;
  }

  public static isInteger(dataType: FIGInputNumberType): boolean {
    return dataType >= FIGInputNumberType.int && dataType <= FIGInputNumberType.int4;
  }

  public static isArray(dataType: FIGInputNumberType): boolean {
    return (
      (dataType >= FIGInputNumberType.int2 && dataType <= FIGInputNumberType.int4) ||
      (dataType >= FIGInputNumberType.float2 && dataType <= FIGInputNumberType.float4)
    );
  }

  public static getArraySize(dataType: FIGInputNumberType): number {
    if (dataType === FIGInputNumberType.int2 || dataType === FIGInputNumberType.float2) {
      return 2;
    } else if (dataType === FIGInputNumberType.int3 || dataType === FIGInputNumberType.float3) {
      return 3;
    } else if (dataType === FIGInputNumberType.int4 || dataType === FIGInputNumberType.float4) {
      return 4;
    }
    return 1;
  }

  public static getPrecision(widget: FIGInputNumberWidget): number | undefined {
    if (FIGInputNumberWidget.isInteger(widget.dataType)) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public static resize(self: FIGInputNumberWidget): number[] {
    const size: number = FIGInputNumberWidget.getArraySize(self.dataType);

    if (size === 1) {
      return [self.value[0]];
    } else if (size === 2) {
      return [self.value[0], self.value[1]];
    } else if (size === 3) {
      return [self.value[0], self.value[1], self.value[2]];
    }
    return [self.value[0], self.value[1], self.value[2], self.value[3]];
  }

  public static roundValues(values: number[], precision: number): void {
    for (let i: number = 0; i < values.length; i++) {
      const round: number = 10 ** precision;
      values[i] = Math.round(values[i] * round) / round;
    }
  }

  public override draw(): void {
    const values: number[] = FIGInputNumberWidget.resize(this);
    const fn: (...args: unknown[]) => void = FIGInputNumberWidget.drawers[this.dataType];
    const args: unknown[] = [this.label];
    const isFloat = !FIGInputNumberWidget.isInteger(this.dataType);

    if (FIGInputNumberWidget.getArraySize(this.dataType) === 1) {
      args.push((_ = values[0]) => (values[0] = _));
      args.push(this.step, this.stepFast);
    } else {
      args.push(values);
    }
    if (isFloat) {
      args.push(this.format);
    }

    fn(...args);

    while (values.length < 4) {
      values.push(0);
    }
    if (isFloat) {
      FIGInputNumberWidget.roundValues(values, getPrecision(this.format) ?? 1);
    }
    this.value = values;

    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }
}
