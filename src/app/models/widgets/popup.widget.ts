import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";

export interface FIGPopupOptions {
  readonly label?: string;
  readonly contextItem?: boolean;
}

export class FIGPopupWidget extends FIGContainer {
  label: string;
  contextItem: boolean;
  isOpen: boolean;
  debugLabel: string;
  debug: boolean;

  constructor(options?: FIGPopupOptions) {
    super(FIGWidgetType.popup, true);
    this.label = options?.label ?? 'Popup';
    this.contextItem = options?.contextItem ?? false;
    this.isOpen = false;
    this.debugLabel = `Open '${this.label}'`;
    this.debug = true;
  }

  public get name(): string {
    return this.label;
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
      super.drawFocus();
    }
    if (prevOpen !== this.isOpen) {
      this.triggerUpdate();
    }
  }
}
