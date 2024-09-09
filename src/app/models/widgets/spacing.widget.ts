import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGSpacingWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.spacing, true);
  }

  public readonly name = 'Spacing';

  public override draw(): void {
    ImGui.Spacing();
    this.scrollTo();
  }
}
