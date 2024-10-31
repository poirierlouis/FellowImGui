import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGMenuOptions {
  readonly label?: string;
  readonly enabled?: boolean;
}

export class FIGMenuWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'enabled', optional: true, default: true}
  ];

  label: string = 'Menu';
  enabled: boolean = true;

  constructor(options?: FIGMenuOptions) {
    super(FIGWidgetType.menu, true);
    this.registerString('label', 'Label', options?.label ?? 'Menu');
    this.registerBool('enabled', 'Enabled', options?.enabled, true, true);
    this._focusOffset.x = 0;
    this._focusOffset.y = 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    if (ImGui.BeginMenu(this.label, this.enabled)) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndMenu();
    }
    this.drawFocus();
    this.scrollTo();
  }
}
