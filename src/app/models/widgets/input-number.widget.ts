import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

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

export class FIGInputNumberWidget extends FIGWithTooltip {
  private static readonly formatRule: RegExp = new RegExp(/^%\.(?<precision>[0-9]+)f$/);

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
    const match: RegExpMatchArray | null = widget.format.match(FIGInputNumberWidget.formatRule);

    return match ? +match.groups!['precision'] : undefined;
  }

  public override draw(): void {
    const prevValue: number | number[] = (this.value instanceof Array) ? [...this.value] : this.value;
    const args: any[] = [this.label];
    let fn: (...args: any[]) => void;

    switch (this.dataType) {
      case FIGInputNumberType.int:
        fn = ImGui.InputInt;
        args.push((_ = this.value) => this.value = _, this.step, this.stepFast);
        break;
      case FIGInputNumberType.int2:
        fn = ImGui.InputInt2;
        args.push(this.value);
        break;
      case FIGInputNumberType.int3:
        fn = ImGui.InputInt3;
        args.push(this.value);
        break;
      case FIGInputNumberType.int4:
        fn = ImGui.InputInt4;
        args.push(this.value);
        break;
      case FIGInputNumberType.float:
        fn = ImGui.InputFloat;
        args.push((_ = this.value) => this.value = _, this.step, this.stepFast, this.format);
        break;
      case FIGInputNumberType.float2:
        fn = ImGui.InputFloat2;
        args.push(this.value, this.format);
        break;
      case FIGInputNumberType.float3:
        fn = ImGui.InputFloat3;
        args.push(this.value, this.format);
        break;
      case FIGInputNumberType.float4:
        fn = ImGui.InputFloat4;
        args.push(this.value, this.format);
        break;
      case FIGInputNumberType.double:
        fn = ImGui.InputDouble;
        args.push((_ = this.value) => this.value = _, this.step, this.stepFast, this.format);
        break;
    }
    fn(...args);
    if (this.diffValues(this.value, prevValue)) {
      this.updateSubject.next();
    }
    super.drawTooltip();
    super.drawFocus();
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
