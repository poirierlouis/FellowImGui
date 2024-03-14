import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export enum FIGArrowDirection {
  left,
  right,
  up,
  down,
  none = -1
}

export class FIGButtonWidget extends FIGWithTooltip {
  text: string;
  isSmall: boolean;
  arrow: FIGArrowDirection;

  constructor(text: string = 'Button', isSmall: boolean = false, arrow: FIGArrowDirection = FIGArrowDirection.none, tooltip?: string) {
    super(FIGWidgetType.button, true);
    this.text = text;
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
      ImGui.Button(this.text);
    }
    super.draw();
  }
}
