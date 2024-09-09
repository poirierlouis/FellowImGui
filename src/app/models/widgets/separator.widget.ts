import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGSeparatorWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.separator, true);
    this._focusOffset.x = -4;
  }

  public readonly name = 'Separator';

  public override draw(): void {
    ImGui.Separator();
    this.drawFocus();
    this.scrollTo();
  }
}
