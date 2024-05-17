import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {getPrecision} from "../string";
import {FIGSerializeProperty} from "../../parsers/document.parser";

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

export interface FIGSliderOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: number | number[];
  readonly valueSpeed?: number;
  readonly valueMin?: number;
  readonly valueMax?: number;
  readonly format?: string;
  readonly power?: number;
  readonly sliderType?: FIGSliderType;
  readonly dataType?: FIGSliderDataType;
}

interface DrawItem {
  readonly functions: ((...args: any[]) => any)[];
  readonly args: (((self: FIGSliderWidget) => any[]) | undefined)[];
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

  private static readonly drawSliderInt = (self: FIGSliderWidget) => [
    (_ = self.value) => self.value = _, self.valueMin, self.valueMax, self.format
  ];
  private static readonly drawSliderIntX = (self: FIGSliderWidget) => [
    self.value, self.valueMin, self.valueMax, self.format
  ];
  private static readonly drawSliderFloat = (self: FIGSliderWidget) => [
    (_ = self.value) => self.value = _, self.valueMin, self.valueMax, self.format, self.power
  ];
  private static readonly drawSliderFloatX = (self: FIGSliderWidget) => [
   self.value, self.valueMin, self.valueMax, self.format, self.power
  ];

  private static readonly drawDragInt = (self: FIGSliderWidget) => [
    (_ = self.value) => self.value = _, self.valueSpeed, self.valueMin, self.valueMax, self.format
  ];
  private static readonly drawDragIntX = (self: FIGSliderWidget) => [
    self.value, self.valueSpeed, self.valueMin, self.valueMax, self.format
  ];
  private static readonly drawDragFloat = (self: FIGSliderWidget) => [
    (_ = self.value) => self.value = _, self.valueSpeed, self.valueMin, self.valueMax, self.format, self.power
  ];
  private static readonly drawDragFloatX = (self: FIGSliderWidget) => [
    self.value, self.valueSpeed, self.valueMin, self.valueMax, self.format, self.power
  ];
  private static readonly drawers: DrawItem[] = [
    {functions: [ImGui.SliderInt, ImGui.DragInt], args: [FIGSliderWidget.drawSliderInt, FIGSliderWidget.drawDragInt]},
    {functions: [ImGui.SliderInt2, ImGui.DragInt2], args: [FIGSliderWidget.drawSliderIntX, FIGSliderWidget.drawDragIntX]},
    {functions: [ImGui.SliderInt3, ImGui.DragInt3], args: [FIGSliderWidget.drawSliderIntX, FIGSliderWidget.drawDragIntX]},
    {functions: [ImGui.SliderInt4, ImGui.DragInt4], args: [FIGSliderWidget.drawSliderIntX, FIGSliderWidget.drawDragIntX]},

    {functions: [ImGui.SliderFloat, ImGui.DragFloat], args: [FIGSliderWidget.drawSliderFloat, FIGSliderWidget.drawDragFloat]},
    {functions: [ImGui.SliderFloat2, ImGui.DragFloat2], args: [FIGSliderWidget.drawSliderFloatX, FIGSliderWidget.drawDragFloatX]},
    {functions: [ImGui.SliderFloat2, ImGui.DragFloat3], args: [FIGSliderWidget.drawSliderFloatX, FIGSliderWidget.drawDragFloatX]},
    {functions: [ImGui.SliderFloat4, ImGui.DragFloat4], args: [FIGSliderWidget.drawSliderFloatX, FIGSliderWidget.drawDragFloatX]},
  ];

  label: string;
  sliderType: FIGSliderType;
  dataType: FIGSliderDataType;
  value: number | number[];
  valueSpeed: number;
  valueMin: number;
  valueMax: number;
  format: string;
  power: number;

  constructor(options?: FIGSliderOptions) {
    super(FIGWidgetType.slider, true);
    this.label = options?.label ?? 'Slider / Drag';
    this.sliderType = options?.sliderType ?? FIGSliderType.slider;
    this.dataType = options?.dataType ?? FIGSliderDataType.int;
    this.value = options?.value ?? 0;
    this.valueSpeed = options?.valueSpeed ?? 0.01;
    this.valueMin = options?.valueMin ?? (FIGSliderWidget.isInteger(this.dataType) ? 0 : 0.01);
    this.valueMax = options?.valueMax ?? (FIGSliderWidget.isInteger(this.dataType) ? 100 : 1.00);
    this.format = options?.format ?? (FIGSliderWidget.isInteger(this.dataType) ? '%d' : '%.2f');
    this.power = options?.power ?? 0;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public static isInteger(dataType: FIGSliderDataType): boolean {
    return dataType >= FIGSliderDataType.int && dataType <= FIGSliderDataType.int4;
  }

  public static isArray(dataType: FIGSliderDataType): boolean {
    return (dataType >= FIGSliderDataType.int2 && dataType <= FIGSliderDataType.int4) ||
      (dataType >= FIGSliderDataType.float2 && dataType <= FIGSliderDataType.float4);
  }

  public static getArraySize(dataType: FIGSliderDataType): number {
    if (dataType === FIGSliderDataType.int2 || dataType === FIGSliderDataType.float2) {
      return 2;
    } else if (dataType === FIGSliderDataType.int3 || dataType === FIGSliderDataType.float3) {
      return 3;
    } else if (dataType === FIGSliderDataType.int4 || dataType === FIGSliderDataType.float4) {
      return 4;
    }
    return 0;
  }

  public static getPrecision(widget: FIGSliderWidget): number | undefined {
    if (this.isInteger(widget.dataType) || widget.format === undefined) {
      return 0;
    }
    return getPrecision(widget.format);
  }

  public override draw(): void {
    const prevValue: number | number[] = (this.value instanceof Array) ? [...this.value] : this.value;
    const drawer: DrawItem = FIGSliderWidget.drawers[this.dataType];
    const fn: any = drawer.functions[this.sliderType];
    const argsData: any = drawer.args[this.sliderType];
    const args: any[] = [this.label];

    args.push(...argsData(this));
    fn(...args);
    if (this.diffValues(this.value, prevValue)) {
      this.triggerUpdate();
    }
    this.drawTooltip();
    this.drawFocus();
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
