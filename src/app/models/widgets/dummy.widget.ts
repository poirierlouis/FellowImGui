import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGDummyOptions extends FIGTooltipOption {
  readonly width?: number;
  readonly height?: number;
}

export class FIGDummyWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'width', optional: true, default: 100},
    {name: 'height', optional: true, default: 100},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  width: number;
  height: number;

  constructor(options?: FIGDummyOptions) {
    super(FIGWidgetType.dummy, true);
    this.width = options?.width ?? 100;
    this.height = options?.height ?? 100;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return 'Dummy';
  }

  public override draw(): void {
    ImGui.Dummy({x: this.width, y: this.height});
    super.drawTooltip();
    super.drawFocus();
  }
}
