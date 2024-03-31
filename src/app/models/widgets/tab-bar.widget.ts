import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {getEnumValues} from "../enum";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGTabBarFlags {
  Reorderable = 1,
  AutoSelectNewTabs = 2,
  TabListPopupButton = 4,
  NoCloseWithMiddleMouseButton = 8,
  NoTabListScrollingButtons = 16,
  NoTooltip = 32,
  FittingPolicyResizeDown = 64,
  FittingPolicyScroll = 128
}

export interface FIGTabBarOptions {
  readonly label?: string;
  readonly flags?: FIGTabBarFlags;
}

export class FIGTabBarWidget extends FIGContainer {
  public static readonly flags: FIGTabBarFlags[] = getEnumValues(FIGTabBarFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'flags', optional: true, default: 0},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  label: string;
  flags: number;

  constructor(options?: FIGTabBarOptions) {
    super(FIGWidgetType.tabBar, true);
    this.label = options?.label ?? 'Tab Bar';
    this.flags = options?.flags ?? 0;
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
    super.drawFocus();
  }
}
