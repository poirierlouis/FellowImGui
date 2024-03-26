import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGSpacingWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.spacing, true);
  }

  public get name(): string {
    return 'Spacing';
  }

  public override draw(): void {
    ImGui.Spacing();
  }
}
