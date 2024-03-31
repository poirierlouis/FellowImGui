import {FIGWidget, FIGWidgetType} from "./widget";
import {plotSin, Size, Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGPlotType {
  lines,
  histogram
}

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

  plotType: FIGPlotType;
  label: string;
  values: number[];
  valueOffset?: number;
  overlayText?: string;
  scaleMin?: number;
  scaleMax?: number;
  size?: Size;
  stride?: number;

  constructor(options?: FIGPlotOptions) {
    super(FIGWidgetType.plot, true);
    this.plotType = options?.plotType ?? FIGPlotType.lines;
    this.label = options?.label ?? 'Lines';
    this.values = options?.values ?? plotSin(31);
    this.valueOffset = options?.valueOffset;
    this.overlayText = options?.overlayText;
    this.scaleMin = options?.scaleMin;
    this.scaleMax = options?.scaleMax;
    this.size = options?.size;
    this.stride = options?.stride;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const size: Vector2 | undefined = this.size ? {x: this.size.width, y: this.size.height} : undefined;

    if (this.plotType === FIGPlotType.lines) {
      ImGui.PlotLines(
        this.label, this.values, this.values.length,
        this.valueOffset, this.overlayText,
        this.scaleMin, this.scaleMax,
        size, this.stride
      );
    } else if (this.plotType === FIGPlotType.histogram) {
      ImGui.PlotHistogram(
        this.label, this.values, this.values.length,
        this.valueOffset, this.overlayText,
        this.scaleMin, this.scaleMax,
        size, this.stride
      );
    }
    super.drawFocus();
  }
}
