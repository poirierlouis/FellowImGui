import type {FIGSerializeProperty} from "../../parsers/document.parser";
import {getEnumValues} from "../enum";
import {type FlagOption, getOptions} from "../fields/flags.field";
import {FIGContainer} from "./container";
import {FIGTabBarFlags, FIGTabBarWidget} from "./tab-bar.widget";
import {FIGWidgetType} from "./widget";

export enum FIGTabItemFlags {
  UnsavedDocument = 1,
  SetSelected = 2,
  NoCloseWithMiddleMouseButton = 4,
  NoPushId = 8,
  NoTooltip = 16,
  NoReorder = 32,
  Leading = 64,
  Trailing = 128,
}

export interface FIGTabItemOptions {
  readonly label?: string;
  readonly flags?: FIGTabItemFlags;
}

export const FIGTabItemFlagsOptions: FlagOption[] = getOptions(FIGTabItemFlags);

export class FIGTabItemWidget extends FIGContainer {
  public static readonly flags: FIGTabItemFlags[] = getEnumValues(FIGTabItemFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "label"},
    {name: "flags", optional: true, default: 0},
  ];

  label: string = "Tab Item";
  flags: number = 0;

  isOpen: boolean;

  constructor(options?: FIGTabItemOptions) {
    super(FIGWidgetType.tabItem, true);
    this.registerString("label", "Label", options?.label ?? "Tab Item");
    this.registerFlags("flags", "Flags", FIGTabItemFlagsOptions, options?.flags, true, 0);
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
      isOpen = ImGui.BeginTabItem(this.label, (_ = this.isOpen) => (this.isOpen = _), this.flags);
    }
    if (isOpen) {
      for (const child of this.children) {
        child.draw();
        child.listen();
        this.growFocusRect();
      }
      ImGui.EndTabItem();
    }
    this.drawFocus();
  }
}
