import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGSeparatorWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.separator, true, 'separator');
    this._focusOffset.x = -4;
  }

  public get name(): string {
    return 'Separator';
  }

  public override draw(): void {
    ImGui.Separator();
    super.draw();
  }
}
