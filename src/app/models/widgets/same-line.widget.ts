import {FIGWidget, FIGWidgetType} from "./widget";

export interface FIGSameLineOptions {
  readonly offsetFromStart?: number;
  readonly spacing?: number;
}

export class FIGSameLineWidget extends FIGWidget {
  offsetFromStart?: number;
  spacing?: number;

  constructor(options?: FIGSameLineOptions) {
    super(FIGWidgetType.sameLine, true);
    this.offsetFromStart = options?.offsetFromStart;
    this.spacing = options?.spacing;
  }

  public get name(): string {
    return 'SameLine';
  }

  public override draw(): void {
    ImGui.SameLine(this.offsetFromStart, this.spacing);
  }
}