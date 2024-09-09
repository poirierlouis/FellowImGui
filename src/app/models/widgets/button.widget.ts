import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGDir {
  left,
  right,
  up,
  down,
  none = -1
}

export interface FIGButtonOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly isFill?: boolean;
  readonly isSmall?: boolean;
  readonly arrow?: FIGDir;
}

export class FIGButtonWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'isFill', optional: true, default: false},
    {name: 'isSmall', optional: true, default: false},
    {name: 'arrow', optional: true, default: FIGDir.none},
    {name: 'tooltip', optional: true, default: undefined},
  ];

  label: string;
  isFill: boolean;
  isSmall: boolean;
  arrow: FIGDir;

  constructor(options?: FIGButtonOptions) {
    super(FIGWidgetType.button, true);
    this.label = options?.label ?? 'Button';
    this.isFill = options?.isFill ?? false;
    this.isSmall = options?.isSmall ?? false;
    this.arrow = options?.arrow ?? FIGDir.none;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    if (this.isSmall) {
      ImGui.SmallButton(this.label);
    } else if (this.arrow !== FIGDir.none) {
      ImGui.ArrowButton(this.label, this.arrow);
    } else {
      const size: Vector2 | undefined = (this.isFill) ? {x: -1.0, y: 0.0} : undefined;

      ImGui.Button(this.label, size);
    }
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }

}
