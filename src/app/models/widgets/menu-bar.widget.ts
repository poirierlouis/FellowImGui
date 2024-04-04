import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FIGWindowFlags, FIGWindowWidget} from "./window.widget";

export interface FIGMenuBarOptions {
}

export class FIGMenuBarWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
  ];

  constructor(options?: FIGMenuBarOptions) {
    super(FIGWidgetType.menuBar, true);
    this._focusOffset.x = 0;
    this._focusOffset.y = 0;
  }

  public get name(): string {
    return 'Menu Bar';
  }

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.menu;
  }

  public override onCreated(): void {
    super.onCreated();
    const window: FIGWindowWidget = this.parent as FIGWindowWidget;

    if ((window.flags & FIGWindowFlags.MenuBar) !== FIGWindowFlags.MenuBar) {
      window.flags |= FIGWindowFlags.MenuBar;
      window.triggerUpdate();
    }
  }

  public override onDeleted(): void {
    super.onDeleted();
    const window: FIGWindowWidget = this.parent as FIGWindowWidget;

    if ((window.flags & FIGWindowFlags.MenuBar) === FIGWindowFlags.MenuBar) {
      window.flags ^= FIGWindowFlags.MenuBar;
      window.triggerUpdate();
    }
  }

  public override draw(): void {
    if (ImGui.BeginMenuBar()) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
      ImGui.EndMenuBar();
    }
    super.drawFocus();
  }
}
