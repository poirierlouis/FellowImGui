import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {Size, Vector2} from "../math";
import {getEnumValues} from "../enum";
import {FIGWindowFlags, FIGWindowFlagsOptions} from "./window.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FIGWidgetHelper} from "./widget.helper";
import {SizeField} from "../fields/size.field";

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

  label: string = 'Child Window';
  size: Size = {width: 0, height: 0};
  frameBorder: boolean = true;
  flags: number = 0;

  constructor(options?: FIGChildWindowOptions) {
    super(FIGWidgetType.childWindow, true);
    this.registerString('label', 'Label', options?.label ?? 'Child Window');
    this.registerSize('size', 'Size', true, options?.size, true, {width: 0, height: 0});
    this.registerBool('frameBorder', 'Show frame border', options?.frameBorder, true, true);
    this.registerFlags('flags', 'Flags', FIGWindowFlagsOptions, options?.flags, true, 0);
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const size: Vector2 | undefined = FIGWidgetHelper.computeSize(this.getField('size') as SizeField);

    if (ImGui.BeginChild(this.label, size, this.frameBorder, this.flags)) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndChild();
    }
    this.drawFocus();
    this.scrollTo();
  }

}
