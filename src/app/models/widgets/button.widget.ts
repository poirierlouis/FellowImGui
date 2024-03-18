import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";

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
      let size: Vector2 | undefined = (this.isFill) ? {x: -1.0, y: 0.0} : undefined;

      ImGui.Button(this.label, size);
    }
    super.drawTooltip();
    super.drawFocus();
  }
}
