import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGButtonWidget extends FIGWidget {
  text: string;

  constructor(text: string = 'Button') {
    super(FIGWidgetType.button, 'button');
    this.text = text;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    ImGui.Button(this.text);
  }
}
