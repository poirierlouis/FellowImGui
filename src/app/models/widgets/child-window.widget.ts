import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size, Vector2} from "../math";
import {getEnumValues} from "../enum";
import {FIGWindowFlags} from "./window.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGChildWindowOptions {
  readonly label?: string;
  readonly size?: Size;
  readonly frameBorder?: boolean;
  readonly flags?: number;
}

export class FIGChildWindowWidget extends FIGContainer {
  public static readonly flags: FIGWindowFlags[] = getEnumValues(FIGWindowFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'size', type: 'object', innerType: [{name: 'width'}, {name: 'height'}]},
    {name: 'frameBorder', optional: true, default: true},
    {name: 'flags', optional: true, default: 0},
  ];

  label: string;
  size: Size;
  frameBorder: boolean;
  flags: number;

  constructor(options?: FIGChildWindowOptions) {
    super(FIGWidgetType.childWindow, true);
    this.label = options?.label ?? 'Child Window';
    this.size = options?.size ?? {width: 0, height: 0};
    this.frameBorder = options?.frameBorder ?? true;
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const size: Vector2 = {x: this.size.width, y: this.size.height};
    const region: Vector2 = ImGui.GetContentRegionAvail();

    if (size.x > 0.0 && size.x <= 1.0) {
      size.x *= region.x;
    }
    if (size.y > 0.0 && size.y <= 1.0) {
      size.y *= region.y;
    }
    if (ImGui.BeginChild(this.label, size, this.frameBorder, this.flags)) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndChild();
    }
    super.drawFocus();
  }

}
