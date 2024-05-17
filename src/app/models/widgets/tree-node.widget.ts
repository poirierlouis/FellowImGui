import {FIGWidgetType} from "./widget";
import {getEnumValues} from "../enum";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGTreeNodeFlags {
  Selected = 1,
  Framed = 2,
  AllowOverlap = 4,
  NoTreePushOnOpen = 8,
  NoAutoOpenOnLog = 16,
  DefaultOpen = 32,
  OpenOnDoubleClick = 64,
  OpenOnArrow = 128,
  Leaf = 256,
  Bullet = 512,
  FramePadding = 1024,
  SpanAvailWidth = 2048,
  SpanFullWidth = 4096,
  NavLeftJumpsBackHere = 8192
}

export interface FIGTreeNodeOptions {
  readonly label?: string;
  readonly flags?: number;
}

export class FIGTreeNodeWidget extends FIGContainer {
  public static readonly flags: FIGTreeNodeFlags[] = getEnumValues(FIGTreeNodeFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'flags', optional: true, default: 0}
  ];

  label: string;
  flags: number;

  constructor(options?: FIGTreeNodeOptions) {
    super(FIGWidgetType.treeNode, true);
    this.label = options?.label ?? 'TreeNode';
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    let isOpen: boolean;

    if (this.flags === 0) {
      isOpen = ImGui.TreeNode(this.label);
    } else {
      isOpen = ImGui.TreeNodeEx(this.label, this.flags);
    }
    this.growFocusRect();
    if (isOpen) {
      for (const child of this.children) {
        child.draw();
        child.listen();
        this.growFocusRect();
      }
      ImGui.TreePop();
    }
    this.drawFocus();
    this.scrollTo();
  }
}
