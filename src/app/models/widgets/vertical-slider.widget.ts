import {FIGWidget, FIGWidgetType} from "./widget";
import {Size, Vector2} from "../math";
import {getPrecision} from "../string";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGVerticalSliderType {
  int,
  float
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

export class FIGVerticalSliderWidget extends FIGWidget {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'dataType'},
    {name: 'label'},
    {name: 'size', type: 'object', innerType: [{name: 'width'}, {name: 'height'}]},
    {name: 'value', optional: true, default: 0},
    {name: 'valueMin'},
    {name: 'valueMax'},
    {name: 'format'},
    {name: 'power', optional: true, default: 0},
    {name: 'tooltip', optional: true, default: true}
  ];

  dataType: FIGVerticalSliderType;
  label: string;
  size: Size;
  value: number;
  valueMin: number;
  valueMax: number;
  format: string;
  power: number;
  tooltip: boolean;

  constructor(options?: FIGVerticalSliderOptions) {
    super(FIGWidgetType.verticalSlider, true);
    this.dataType = options?.dataType ?? FIGVerticalSliderType.int;
    this.label = options?.label ?? '##VSlider';
    this.size = options?.size ?? {width: 24, height: 128};
    this.value = options?.value ?? 0;
    this.valueMin = options?.valueMin ?? ((this.dataType === FIGVerticalSliderType.int) ? 0 : 0.0);
    this.valueMax = options?.valueMax ?? ((this.dataType === FIGVerticalSliderType.int) ? 5 : 1.0);
    this.format = options?.format ?? ((this.dataType === FIGVerticalSliderType.int) ? '%d' : '%.3f');
    this.power = options?.power ?? 0;
    this.tooltip = options?.tooltip ?? true;
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override draw(): void {
    const size: Vector2 = {x: this.size.width, y: this.size.height};
    const prevValue: number = this.value;
    const access = (_ = this.value) => this.value = _;
    const format: string = (this.tooltip) ? '' : this.format;

    if (this.dataType === FIGVerticalSliderType.int) {
      ImGui.VSliderInt(this.label, size, access, this.valueMin, this.valueMax, format);
    } else if (this.dataType === FIGVerticalSliderType.float) {
      ImGui.VSliderFloat(this.label, size, access, this.valueMin, this.valueMax, format, this.power);
    }
    if (this.tooltip && (ImGui.IsItemActive() || ImGui.IsItemHovered())) {
      const precision: number | undefined = getPrecision(this.format);

      if (precision === undefined) {
        ImGui.SetTooltip(this.value.toString());
      } else {
        ImGui.SetTooltip(this.value.toFixed(precision));
      }
    }
    this.drawFocus();
    this.scrollTo();
    if (prevValue !== this.value) {
      this.triggerUpdate();
    }
  }
}
