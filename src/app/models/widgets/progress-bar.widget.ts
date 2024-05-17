import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGProgressBarOptions extends FIGTooltipOption {
  readonly value?: number;
  readonly label?: string;
  readonly isFill?: boolean;
}

export class FIGProgressBarWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'value', optional: true, default: 0.0},
    {name: 'label', optional: true, default: undefined},
    {name: 'isFill', optional: true, default: false},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  value: number;
  label?: string;
  isFill: boolean;

  constructor(options?: FIGProgressBarOptions) {
    super(FIGWidgetType.progressBar, true);
    this.value = options?.value ?? 0.0;
    this.label = options?.label;
    this.isFill = options?.isFill ?? false;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label ?? `${(this.value * 100).toFixed(0)} %`;
  }

  public override draw(): void {
    const progression: string = `${(this.value * 100.0).toFixed(0)}%`;
    const size: Vector2 = {x: 0, y: 0};

    if (this.isFill) {
      size.x = -1;
    }
    ImGui.ProgressBar(this.value, size, progression);
    this.growFocusRect();
    this.listen();
    let showTooltip: boolean = ImGui.IsItemHovered();

    if (this.label && !this.isFill) {
      ImGui.SameLine(0.0, ImGui.GetStyle().ItemInnerSpacing.x);
      ImGui.Text(this.label);
      showTooltip ||= ImGui.IsItemHovered();
    }
    if (this.tooltip && showTooltip) {
      ImGui.SetTooltip(this.tooltip);
    }
    this.drawFocus();
  }
}
