import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {getEnumValues} from "../enum";
import {FlagOption, getOptions} from "../fields/flags.field";

export enum FIGTableFlags {
  Resizable = 1,
  Reorderable = 2,
  Hideable = 4,
  Sortable = 8,
  NoSavedSettings = 16,
  ContextMenuInBody = 32,
  RowBg = 64,
  BordersInnerH = 128,
  BordersOuterH = 256,
  BordersH = 384,
  BordersInnerV = 512,
  BordersInner = 640,
  BordersOuterV = 1024,
  BordersOuter = 1280,
  BordersV = 1536,
  Borders = 1920,
  NoBordersInBody = 2048,
  NoBordersInBodyUntilResize = 4096,
  SizingFixedFit = 8192,
  SizingFixedSame = 16384,
  SizingStretchProp = 24576,
  SizingStretchSame = 32768,
  NoHostExtendX = 65536,
  NoHostExtendY = 131072,
  NoKeepColumnsVisible = 262144,
  PreciseWidths = 524288,
  NoClip = 1048576,
  PadOuterX = 2097152,
  NoPadOuterX = 4194304,
  NoPadInnerX = 8388608,
  ScrollX = 16777216,
  ScrollY = 33554432,
  SortMulti = 67108864,
  SortTristate = 134217728
}

export interface FIGTableOptions {
  readonly label?: string;
  readonly columns?: number;
  readonly flags?: number;
}

export const FIGTableFlagsOptions: FlagOption[] = getOptions(FIGTableFlags);

export class FIGTableWidget extends FIGContainer {
  public static readonly flags: FIGTableFlags[] = getEnumValues(FIGTableFlags);
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'columns', optional: true, default: 2},
    {
      name: 'flags',
      optional: true,
      default: FIGTableFlags.RowBg | FIGTableFlags.Resizable
    },
  ];

  label: string = '##Table';
  columns: number = 2;
  flags: number = FIGTableFlags.RowBg | FIGTableFlags.Resizable;

  constructor(options?: FIGTableOptions) {
    super(FIGWidgetType.table, true);
    this.registerString('label', 'Label', options?.label ?? '##Table');
    this.registerInteger('columns', 'Columns', options?.columns, true, 2);
    this.registerFlags('flags', 'Flags', FIGTableFlagsOptions, options?.flags, true, FIGTableFlags.RowBg | FIGTableFlags.Resizable);
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.tableRow || type === FIGWidgetType.blocFor;
  }

  public override draw(): void {
    if (ImGui.BeginTable(this.label, this.columns, this.flags)) {
      for (const row of this.children) {
        row.draw();
        this.growFocusRect();
      }
      ImGui.EndTable();
    }
    this.drawFocus();
    this.scrollTo();
  }
}
