import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";
import {Color} from "../math";

export class FIGInputColorEditWidget extends FIGWithTooltip {
  color: Color;
  text: string;

  withAlpha: boolean;

  constructor(text: string = 'Input Color Edit', tooltip?: string) {
    super(FIGWidgetType.inputColorEdit, true);
    this.color = {r: 0.5, g: 0.5, b: 0.5, a: 0.5};
    this.text = text;
    this.withAlpha = false;
    this.tooltip = tooltip;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const values: number[] = [this.color.r, this.color.g, this.color.b, this.color.a];
    const prevValues: number[] = [...values];

    if (!this.withAlpha) {
      ImGui.ColorEdit3(this.text, values);
    } else {
      ImGui.ColorEdit4(this.text, values);
    }
    if (this.diffColor(prevValues, values)) {
      this.color.r = values[0];
      this.color.g = values[1];
      this.color.b = values[2];
      this.color.a = values[3];
      this.updateSubject.next();
    }
    super.drawTooltip();
    super.drawFocus();
  }

  private diffColor(prevColor: number[], color: number[]): boolean {
    for (let i = 0; i < 4; i++) {
      if (prevColor[i] !== color[i]) {
        return true;
      }
    }
    return false;
  }
}
