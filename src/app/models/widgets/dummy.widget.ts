import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {Size, Vector2} from "../math";
import {FIGWidgetHelper} from "./widget.helper";
import {SizeField} from "../fields/size.field";

export interface FIGDummyOptions extends FIGTooltipOption {
  readonly width?: number;
  readonly height?: number;
  readonly size?: Size;
}

// TODO: fix serialization, from width/height to size
export class FIGDummyWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'width', optional: true, default: 100},
    {name: 'height', optional: true, default: 100},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  public readonly name = 'Dummy';

  size: Size = {width: 100, height: 100};

  constructor(options?: FIGDummyOptions) {
    super(FIGWidgetType.dummy, true);
    let size: Size | undefined = options?.size;

    if (options?.width !== undefined && options?.height !== undefined) {
      size = {width: options.width, height: options.height};
    }
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerSize('size', 'Size', true, size, true, {width: 100, height: 100});
  }

  public override draw(): void {
    const size: Vector2 | undefined = FIGWidgetHelper.computeSize(this.getField('size') as SizeField);

    ImGui.Dummy(size);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }
}
