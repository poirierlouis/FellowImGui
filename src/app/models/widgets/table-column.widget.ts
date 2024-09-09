import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export enum FIGTableColumnFlags {
  Disabled = 1,
  DefaultHide = 2,
  DefaultSort = 4,
  WidthStretch = 8,
  WidthFixed = 16,
  NoResize = 32,
  NoReorder = 64,
  NoHide = 128,
  NoClip = 256,
  NoSort = 512,
  NoSortAscending = 1024,
  NoSortDescending = 2048,
  NoHeaderLabel = 4096,
  NoHeaderWidth = 8192,
  PreferSortAscending = 16384,
  PreferSortDescending = 32768,
  IndentEnable = 65536,
  IndentDisable = 131072,
  IsEnabled = 16777216,
  IsVisible = 33554432,
  IsSorted = 67108864,
  IsHovered = 134217728
}

export type FIGTableColumnOptions = object;

export class FIGTableColumnWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
  ];

  constructor(_options?: FIGTableColumnOptions) {
    super(FIGWidgetType.tableColumn, true);
  }

  public readonly name: string = 'Table Column';

  public override draw(): void {
    ImGui.TableNextColumn();
    for (const child of this.children) {
      child.draw();
      child.listen();
      this.growFocusRect();
    }
    this.drawFocus();
  }
}
