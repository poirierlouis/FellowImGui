import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {getPrecision} from "../string";
import {FIGSerializeProperty} from "../../parsers/document.parser";

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

export interface FIGInputNumberOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: number | number[];
  readonly step?: number;
  readonly stepFast?: number;
  readonly format?: string;
  readonly dataType?: FIGInputNumberType;
}

interface DrawItem {
  readonly fn: (...args: any[]) => any;
  readonly args: (self: FIGInputNumberWidget) => any[];
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
      args: (self: FIGInputNumberWidget) => [(_ = self.value) => self.value = _, self.step, self.stepFast]
    },
    {fn: ImGui.InputInt2, args: (self: FIGInputNumberWidget) => [self.value]},
    {fn: ImGui.InputInt3, args: (self: FIGInputNumberWidget) => [self.value]},
    {fn: ImGui.InputInt4, args: (self: FIGInputNumberWidget) => [self.value]},

    {
      fn: ImGui.InputFloat,
      args: (self: FIGInputNumberWidget) => [(_ = self.value) => self.value = _, self.step, self.stepFast, self.format]
    },
    {fn: ImGui.InputFloat2, args: (self: FIGInputNumberWidget) => [self.value, self.format]},
    {fn: ImGui.InputFloat3, args: (self: FIGInputNumberWidget) => [self.value, self.format]},
    {fn: ImGui.InputFloat4, args: (self: FIGInputNumberWidget) => [self.value, self.format]},

    {
      fn: ImGui.InputDouble,
      args: (self: FIGInputNumberWidget) => [(_ = self.value) => self.value = _, self.step, self.stepFast, self.format]
    }
  ];

  label: string;
  dataType: FIGInputNumberType;
  value: number | number[];
  step: number;
  stepFast: number;
  format: string;

  constructor(options?: FIGInputNumberOptions) {
    super(FIGWidgetType.inputNumber, true);
    this.label = options?.label ?? 'Input Number';
    this.dataType = options?.dataType ?? FIGInputNumberType.int;
    this.value = options?.value ?? 0;
    this.step = options?.step ?? (FIGInputNumberWidget.isInteger(this.dataType) ? 1 : 0.01);
    this.stepFast = options?.stepFast ?? (FIGInputNumberWidget.isInteger(this.dataType) ? 10 : 1);
    this.format = options?.format ?? (this.dataType === FIGInputNumberType.double ? '%.8f' : '%.3f');
    this.tooltip = options?.tooltip;
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
    return 0;
  }

  public static getPrecision(widget: FIGInputNumberWidget): number | undefined {
    if (this.isInteger(widget.dataType)) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public override draw(): void {
    const prevValue: number | number[] = (this.value instanceof Array) ? [...this.value] : this.value;
    const drawer: DrawItem = FIGInputNumberWidget.drawers[this.dataType];
    const args: any[] = [this.label];

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
