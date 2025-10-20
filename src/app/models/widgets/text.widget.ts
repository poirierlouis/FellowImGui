import type {FIGSerializeProperty} from "../../parsers/document.parser";
import type {Color} from "../math";
import {FIGWidgetType} from "./widget";
import {type FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGTextOptions extends FIGTooltipOption {
  readonly text?: string;
  readonly color?: Color;
  readonly isDisabled?: boolean;
  readonly isWrapped?: boolean;
  readonly hasBullet?: boolean;
  readonly align?: boolean;
}

export class FIGTextWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: "text"},
    {
      name: "color",
      optional: true,
      default: undefined,
      type: "object",
      innerType: [{name: "r"}, {name: "g"}, {name: "b"}, {name: "a"}],
    },
    {name: "isDisabled", optional: true, default: false},
    {name: "isWrapped", optional: true, default: false},
    {name: "hasBullet", optional: true, default: false},
    {name: "align", optional: true, default: false},
    {name: "tooltip", optional: true, default: undefined},
  ];

  text: string = "Text";
  color?: Color;
  isDisabled: boolean = false;
  isWrapped: boolean = false;
  hasBullet: boolean = false;
  align: boolean = false;

  constructor(options?: FIGTextOptions) {
    super(FIGWidgetType.text, true);
    this.registerString("text", "Text", options?.text ?? "Text");
    this.registerString("tooltip", "Tooltip", options?.tooltip, true);
    this.registerColor("color", "Color", options?.color, true);
    this.registerBool("isDisabled", "Disabled", options?.isDisabled, true, false);
    this.registerBool("isWrapped", "Wrapped", options?.isWrapped, true, false);
    this.registerBool("hasBullet", "Bullet", options?.hasBullet, true, false);
    this.registerBool("align", "Align to frame padding", options?.align, true, false);
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    if (this.align) {
      ImGui.AlignTextToFramePadding();
    }
    if (this.isDisabled) {
      ImGui.BeginDisabled(true);
    } else if (this.color) {
      ImGui.PushStyleColor(0, new ImGui.Vec4(this.color.r, this.color.g, this.color.b, this.color.a));
    }
    if (this.hasBullet) {
      ImGui.Bullet();
      this.growFocusRect();
    }
    if (this.isWrapped) {
      ImGui.TextWrapped(this.text);
    } else {
      ImGui.Text(this.text);
    }
    if (this.isDisabled) {
      ImGui.EndDisabled();
    } else if (this.color) {
      ImGui.PopStyleColor();
    }
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }
}
