import type {FIGSerializeProperty} from "../../parsers/document.parser";
import {getEnumValues} from "../enum";
import {type FlagOption, getOptions} from "../fields/flags.field";
import {FIGContainer} from "./container";
import {FIGWidgetType} from "./widget";

export enum FIGTabBarFlags {
  Reorderable = 1,
  AutoSelectNewTabs = 2,
  TabListPopupButton = 4,
  NoCloseWithMiddleMouseButton = 8,
  NoTabListScrollingButtons = 16,
  NoTooltip = 32,
  FittingPolicyResizeDown = 64,
  FittingPolicyScroll = 128,
}

export interface FIGTabBarOptions {
  readonly label?: string;
  readonly flags?: FIGTabBarFlags;
}

export const FIGTabBarFlagsOptions: FlagOption[] = getOptions(FIGTabBarFlags);

export class FIGTabBarWidget extends FIGContainer {
  public static readonly flags: FIGTabBarFlags[] = getEnumValues(FIGTabBarFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "label"},
    {name: "flags", optional: true, default: 0},
    {name: "tooltip", optional: true, default: undefined},
  ];

  label: string = "Tab Bar";
  flags: number = 0;

  constructor(options?: FIGTabBarOptions) {
    super(FIGWidgetType.tabBar, true);
    this.registerString("label", "String ID", options?.label ?? "Tab Bar");
    this.registerFlags("flags", "Flags", FIGTabBarFlagsOptions, options?.flags, true, 0);
    this._focusOffset.y = 0;
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.tabItem;
  }

  public override draw(): void {
    if (ImGui.BeginTabBar(this.label, this.flags)) {
      for (const tabItem of this.children) {
        tabItem.draw();
        this.growFocusRect();
      }
      ImGui.EndTabBar();
    }
    this.drawFocus();
    this.scrollTo();
  }
}
