import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGNewLineWidget extends FIGWidget {

  constructor() {
    super(FIGWidgetType.newLine, true);
  }

  public get name(): string {
    return 'NewLine';
  }

  public override draw(): void {
    ImGui.NewLine();
  }
}
