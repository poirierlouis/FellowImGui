import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {getPrecision} from "../string";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {EnumOption} from "../fields/enum.field";

export enum FIGInputNumberType {
  int,
  int2,
  int3,
  int4,

  float,
  float2,
  float3,
  float4,

  double
}

export const FIGInputNumberTypeOptions: EnumOption[] = [
  {value: FIGInputNumberType.int, label: 'Int'},
  {value: FIGInputNumberType.int2, label: 'Int2'},
  {value: FIGInputNumberType.int3, label: 'Int3'},
  {value: FIGInputNumberType.int4, label: 'Int4'},
  {value: FIGInputNumberType.float, label: 'Float'},
  {value: FIGInputNumberType.float2, label: 'Float2'},
  {value: FIGInputNumberType.float3, label: 'Float3'},
  {value: FIGInputNumberType.float4, label: 'Float4'},
  {value: FIGInputNumberType.double, label: 'Double'},
];


export interface FIGInputNumberOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: number[];
  readonly step?: number;
  readonly stepFast?: number;
  readonly format?: string;
  readonly dataType?: FIGInputNumberType;
}

interface DrawItem {
  readonly fn: (...args: unknown[]) => unknown;
  readonly args: (self: FIGInputNumberWidget) => unknown[];
}

export class FIGInputNumberWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'dataType'},
    {name: 'value', optional: true, default: 0},
    {name: 'step'},
    {name: 'stepFast'},
    {name: 'format'},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  private static readonly drawers: DrawItem[] = [
    {
      fn: ImGui.InputInt,
      args: (self: FIGInputNumberWidget) => [(_ = self.value[0]) => self.value[0] = _, self.step, self.stepFast]
    },
    {fn: ImGui.InputInt2, args: (self: FIGInputNumberWidget) => [self.value]},
    {fn: ImGui.InputInt3, args: (self: FIGInputNumberWidget) => [self.value]},
    {fn: ImGui.InputInt4, args: (self: FIGInputNumberWidget) => [self.value]},

    {
      fn: ImGui.InputFloat,
      args: (self: FIGInputNumberWidget) => [(_ = self.value[0]) => self.value[0] = _, self.step, self.stepFast, self.format]
    },
    {fn: ImGui.InputFloat2, args: (self: FIGInputNumberWidget) => [self.value, self.format]},
    {fn: ImGui.InputFloat3, args: (self: FIGInputNumberWidget) => [self.value, self.format]},
    {fn: ImGui.InputFloat4, args: (self: FIGInputNumberWidget) => [self.value, self.format]},

    {
      fn: ImGui.InputDouble,
      args: (self: FIGInputNumberWidget) => [(_ = self.value[0]) => self.value[0] = _, self.step, self.stepFast, self.format]
    }
  ];

  label: string = 'Input Number';
  dataType: FIGInputNumberType = FIGInputNumberType.int;
  value: number[] = [0];
  step: number = 1;
  stepFast: number = 10;
  format: string = '%.3f';

  constructor(options?: FIGInputNumberOptions) {
    super(FIGWidgetType.inputNumber, true);
    this.registerString('label', 'Label', options?.label ?? 'Input Number');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerEnum('dataType', 'Data type', FIGInputNumberTypeOptions, options?.dataType, true, FIGInputNumberType.int);
    this.registerArray('value', 'Value', options?.value, true, [0]);
    this.registerNumber('step', 'Step', options?.step, true, (FIGInputNumberWidget.isInteger(this.dataType) ? 1 : 0.01));
    this.registerNumber('stepFast', 'Step fast', options?.stepFast, true, (FIGInputNumberWidget.isInteger(this.dataType) ? 10 : 1));
    this.registerString('format', 'Format', options?.format, true, (this.dataType === FIGInputNumberType.double ? '%.8f' : '%.3f'));
  }

  public get name(): string {
    return this.label;
  }

  public static isInteger(dataType: FIGInputNumberType): boolean {
    return dataType >= FIGInputNumberType.int && dataType <= FIGInputNumberType.int4;
  }

  public static isArray(dataType: FIGInputNumberType): boolean {
    return (dataType >= FIGInputNumberType.int2 && dataType <= FIGInputNumberType.int4) ||
      (dataType >= FIGInputNumberType.float2 && dataType <= FIGInputNumberType.float4);
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
    if (this.isInteger(widget.dataType)) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public override draw(): void {
    const prevValue: number | number[] = [...this.value];
    const drawer: DrawItem = FIGInputNumberWidget.drawers[this.dataType];
    const args: unknown[] = [this.label];

    args.push(...drawer.args(this));
    drawer.fn(...args);
    if (this.diffValues(this.value, prevValue)) {
      this.triggerUpdate();
    }
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }

  private diffValues(values: number | number[], prevValues: number | number[]): boolean {
    if (values instanceof Array && prevValues instanceof Array) {
      for (let i: number = 0; i < values.length; i++) {
        if (values[i] !== prevValues[i]) {
          return true;
        }
      }
      return false;
    }
    return values !== prevValues;
  }

}
