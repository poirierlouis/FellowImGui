import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGNewLineWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.newLine, true);
  }

  public readonly name = 'NewLine';

  public override draw(): void {
    ImGui.NewLine();
    this.scrollTo();
  }
}
