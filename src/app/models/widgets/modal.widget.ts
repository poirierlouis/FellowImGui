import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {getEnumValues} from "../enum";
import {FIGWindowFlags, FIGWindowFlagsOptions} from "./window.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGModalOptions {
  readonly label?: string;
  readonly flags?: number;
  readonly isOpen?: boolean;
}

export class FIGModalWidget extends FIGContainer {
  public static readonly flags: FIGWindowFlags[] = getEnumValues(FIGWindowFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string = 'Modal';
  flags: number = 0;

  isOpen: boolean;
  debug: boolean;

  constructor(options?: FIGModalOptions) {
    super(FIGWidgetType.modal, true);
    this.registerString('label', 'Label', options?.label ?? 'Modal');
    this.registerFlags('flags', 'flags', FIGWindowFlagsOptions, options?.flags, true, 0);
    this.isOpen = false;
    this.debug = true;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const prevOpen: boolean = this.isOpen;

    if (this.debug && ImGui.Button(`Open modal '${this.label}'`)) {
      this.isOpen = true;
    }
    if (this.isOpen) {
      ImGui.OpenPopup(this.label);
    }
    if (ImGui.BeginPopupModal(this.label, (_ = this.isOpen) => this.isOpen = _, this.flags)) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndPopup();
    }
    if (this.debug) {
      this.drawFocus();
    }
    if (prevOpen !== this.isOpen) {
      this.triggerUpdate();
    }
  }
}
