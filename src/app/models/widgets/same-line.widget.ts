import type {FIGSerializeProperty} from "../../parsers/document.parser";
import {FIGWidget, FIGWidgetType} from "./widget";

export interface FIGSameLineOptions {
  readonly offsetFromStart?: number;
  readonly spacing?: number;
}

export class FIGSameLineWidget extends FIGWidget {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "offsetFromStart", optional: true, default: undefined},
    {name: "spacing", optional: true, default: undefined},
  ];

  offsetFromStart?: number;
  spacing?: number;

  constructor(options?: FIGSameLineOptions) {
    super(FIGWidgetType.sameLine, true);
    this.registerInteger("offsetFromStart", "Offset from start", options?.offsetFromStart, true);
    this.registerInteger("spacing", "Spacing", options?.spacing, true);
  }

  public readonly name = "SameLine";

  public override draw(): void {
    ImGui.SameLine(this.offsetFromStart, this.spacing);
    this.scrollTo();
  }
}
