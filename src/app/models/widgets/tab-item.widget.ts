import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {getEnumValues} from "../enum";
import {FIGTabBarFlags, FIGTabBarWidget} from "./tab-bar.widget";

export enum FIGTabItemFlags {
  UnsavedDocument = 1,
  SetSelected = 2,
  NoCloseWithMiddleMouseButton = 4,
  NoPushId = 8,
  NoTooltip = 16,
  NoReorder = 32,
  Leading = 64,
  Trailing = 128
}

export interface FIGTabItemOptions {
  readonly label?: string;
  readonly flags?: FIGTabItemFlags;
}

export class FIGTabItemWidget extends FIGContainer {
  public static readonly flags: FIGTabItemFlags[] = getEnumValues(FIGTabItemFlags);

  label: string;
  flags: number;

  isOpen: boolean;

  constructor(options?: FIGTabItemOptions) {
    super(FIGWidgetType.tabItem, true);
    this.label = options?.label ?? 'Tab Item';
    this.flags = options?.flags ?? 0;
    this.isOpen = true;
  }

  public get name(): string {
    return this.label;
  }

  public override onMoved() {
    if (!this.parent || !(this.parent instanceof FIGTabBarWidget)) {
      return;
    }
    const tabBar: FIGTabBarWidget = this.parent;

    tabBar.flags ^= FIGTabBarFlags.Reorderable;
    setTimeout(() => {
      tabBar.flags ^= FIGTabBarFlags.Reorderable;
    });
  }

  public override draw() {
    let isOpen: boolean;

    if (this.flags === 0) {
      isOpen = ImGui.BeginTabItem(this.label);
    } else {
      isOpen = ImGui.BeginTabItem(this.label, (_ = this.isOpen) => this.isOpen = _, this.flags);
    }
    if (isOpen) {
      for (const child of this.children) {
        child.draw();
        child.listen();
        this.growFocusRect();
      }
      ImGui.EndTabItem();
    }
    super.drawFocus();
  }

}
