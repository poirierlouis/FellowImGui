import {FIGWidget, FIGWidgetType} from "./widget";
import {Color} from "../math";

export class FIGTextWidget extends FIGWidget {
  text: string;
  color?: Color;
  isDisabled: boolean = false;
  hasBullet: boolean = false;

  constructor(text: string = 'Text') {
    super(FIGWidgetType.text, true, 'text');
    this.text = text;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    if (this.hasBullet) {
      ImGui.Bullet();
    }
    if (this.isDisabled) {
      ImGui.TextDisabled(this.text);
    } else if (this.color) {
      ImGui.TextColored(new ImGui.Vec4(this.color.r, this.color.g, this.color.b, this.color.a), this.text);
    } else {
      ImGui.Text(this.text);
    }
  }
}
