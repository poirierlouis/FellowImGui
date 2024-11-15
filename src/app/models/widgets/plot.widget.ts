import {FIGWidget, FIGWidgetType} from "./widget";
import {plotSin, Size, Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {EnumOption} from "../fields/enum.field";

export enum FIGPlotType {
  lines,
  histogram
}

export const FIGPlotTypeOptions: EnumOption[] = [
  {value: FIGPlotType.lines, label: 'Lines'},
  {value: FIGPlotType.histogram, label: 'Histogram'},
];

export interface FIGPlotOptions {
  readonly plotType?: FIGPlotType;
  readonly label?: string;
  readonly values?: number[];
  readonly valueOffset?: number;
  readonly overlayText?: string;
  readonly scaleMin?: number;
  readonly scaleMax?: number;
  readonly size?: Size;
  readonly stride?: number;
}

export class FIGPlotWidget extends FIGWidget {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'plotType', optional: true, default: FIGPlotType.lines},
    {name: 'label'},
    {name: 'valueOffset', optional: true, default: undefined},
    {name: 'overlayText', optional: true, default: undefined},
    {name: 'scaleMin', optional: true, default: undefined},
    {name: 'scaleMax', optional: true, default: undefined},
    {
      name: 'size',
      optional: true,
      default: undefined,
      type: 'object',
      innerType: [{name: 'width'}, {name: 'height'}]
    },
    {name: 'stride', optional: true, default: undefined}
  ];

  label: string = '';
  plotType: FIGPlotType = FIGPlotType.lines;
  valueOffset?: number;
  overlayText?: string;
  scaleMin?: number;
  scaleMax?: number;
  size?: Size;
  stride?: number;

  values: number[] = plotSin(31);

  constructor(options?: FIGPlotOptions) {
    super(FIGWidgetType.plot, true);
    this.registerString('label', 'Label', options?.label ?? 'Lines');
    this.registerEnum('plotType', 'Plot Type', FIGPlotTypeOptions, options?.plotType, true, FIGPlotType.lines);
    this.registerString('overlayText', 'Overlay text', options?.overlayText, true);
    this.registerSize('size', 'Size', false, options?.size, true, {width: 0, height: 100});
    this.registerInteger('valueOffset', 'Value offset', options?.valueOffset, true);
    this.registerFloat('scaleMin', 'Scale min', options?.scaleMin, true);
    this.registerFloat('scaleMax', 'Scale max', options?.scaleMax, true);
    this.registerInteger('stride', 'Stride', options?.stride, true);
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const size: Vector2 | undefined = this.size ? {x: this.size.width, y: this.size.height} : undefined;
    let plotFn: (...args: unknown[]) => void = ImGui.PlotLines;

    if (this.plotType === FIGPlotType.lines) {
      plotFn = ImGui.PlotLines;
    } else if (this.plotType === FIGPlotType.histogram) {
      plotFn = ImGui.PlotHistogram;
    }
    plotFn(
      this.label, this.values, this.values.length,
      this.valueOffset, this.overlayText,
      this.scaleMin, this.scaleMax,
      size, this.stride
    );
    this.drawFocus();
    this.scrollTo();
  }
}
