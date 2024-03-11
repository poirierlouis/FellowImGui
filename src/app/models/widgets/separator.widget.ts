import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGSeparatorWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.separator, true, 'separator');
  }

  public get name(): string {
    return 'Separator';
  }

  public override draw(): void {
    ImGui.Separator();
  }
}
