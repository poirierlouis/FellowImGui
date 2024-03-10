import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGTextWidget extends FIGWidget {
  text: string;

  constructor(text: string = 'Welcome') {
    super(FIGWidgetType.text, true, 'text');
    this.text = text;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    ImGui.Text(this.text);
  }
}
