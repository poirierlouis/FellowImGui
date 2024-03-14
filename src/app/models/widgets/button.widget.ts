import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";

export enum FIGArrowDirection {
  left,
  right,
  up,
  down,
  none = -1
}

export class FIGButtonWidget extends FIGWithTooltip {
  text: string;
  isFill: boolean;
  isSmall: boolean;
  arrow: FIGArrowDirection;

  constructor(text: string = 'Button',
              isFill: boolean = false,
              isSmall: boolean = false,
              arrow: FIGArrowDirection = FIGArrowDirection.none,
              tooltip?: string) {
    super(FIGWidgetType.button, true);
    this.text = text;
    this.isFill = isFill;
    this.isSmall = isSmall;
    this.arrow = arrow;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    if (this.isSmall) {
      ImGui.SmallButton(this.text);
    } else if (this.arrow !== FIGArrowDirection.none) {
      ImGui.ArrowButton(this.text, this.arrow);
    } else {
      let size: Vector2 | undefined = (this.isFill) ? {x: -1.0, y: 0.0} : undefined;

      ImGui.Button(this.text, size);
    }
    super.draw();
  }
}
