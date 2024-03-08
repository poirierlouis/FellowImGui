import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGTextWidget extends FIGWidget {
  text: string;

  constructor(text: string = 'Welcome') {
    super(FIGWidgetType.text, 'text');
    this.text = text;
  }

  public get name(): string {
    return this.text;
  }

  public override render(): void {
    ImGui.Text(this.text);
  }
}
