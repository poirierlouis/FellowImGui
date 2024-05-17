import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGPopupOptions {
  readonly label?: string;
  readonly contextItem?: boolean;
}

export class FIGPopupWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'contextItem', optional: true, default: false}
  ];

  label: string;
  contextItem: boolean;
  isOpen: boolean;
  debugLabel: string;
  debug: boolean;

  constructor(options?: FIGPopupOptions) {
    super(FIGWidgetType.popup, true);
    this.label = options?.label ?? '##Popup';
    this.contextItem = options?.contextItem ?? false;
    this.isOpen = false;
    this.debugLabel = `Open '${this.label.slice(2)}'`;
    this.debug = true;
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override draw(): void {
    const prevOpen: boolean = this.isOpen;
    const fn: (label: string) => boolean = (this.contextItem) ? ImGui.BeginPopupContextItem : ImGui.BeginPopup;

    if (this.debug && ImGui.Button(this.debugLabel)) {
      if (!this.contextItem) {
        ImGui.OpenPopup(this.label);
        this.isOpen = true;
      }
    }
    if (fn(this.label)) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndPopup();
    }
    if (this.debug) {
      this.drawFocus();
      this.scrollTo();
    }
    if (prevOpen !== this.isOpen) {
      this.triggerUpdate();
    }
  }
}
