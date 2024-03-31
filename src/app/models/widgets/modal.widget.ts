import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {getEnumValues} from "../enum";
import {FIGWindowFlags} from "./window.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGModalOptions {
  readonly label?: string;
  readonly isOpen?: boolean;
  readonly flags?: number;
}

export class FIGModalWidget extends FIGContainer {
  public static readonly flags: FIGWindowFlags[] = getEnumValues(FIGWindowFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string;
  isOpen: boolean;
  flags: number;

  debug: boolean;

  constructor(options?: FIGModalOptions) {
    super(FIGWidgetType.modal, true);
    this.label = options?.label ?? 'Modal';
    this.isOpen = false;
    this.flags = options?.flags ?? 0;
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
      super.drawFocus();
    }
    if (prevOpen !== this.isOpen) {
      this.triggerUpdate();
    }
  }
}
