import type {FIGDocument} from "../models/document";
import {FIGBlocForWidget} from "../models/widgets/bloc-for.widget";
import {FIGBulletWidget} from "../models/widgets/bullet.widget";
import {FIGButtonWidget} from "../models/widgets/button.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGChildWindowWidget} from "../models/widgets/child-window.widget";
import {FIGCollapsingHeaderWidget} from "../models/widgets/collapsing-header.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGDummyWidget} from "../models/widgets/dummy.widget";
import {FIGGroupWidget} from "../models/widgets/group.widget";
import {FIGInputColorEditWidget} from "../models/widgets/input-color-edit.widget";
import {FIGInputNumberWidget} from "../models/widgets/input-number.widget";
import {FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGInputTextareaWidget} from "../models/widgets/input-textarea.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGListBoxWidget} from "../models/widgets/listbox.widget";
import {FIGMenuWidget} from "../models/widgets/menu.widget";
import {FIGMenuBarWidget} from "../models/widgets/menu-bar.widget";
import {FIGMenuItemWidget} from "../models/widgets/menu-item.widget";
import {FIGModalWidget} from "../models/widgets/modal.widget";
import {FIGNewLineWidget} from "../models/widgets/new-line.widget";
import {FIGPlotWidget} from "../models/widgets/plot.widget";
import {FIGPopupWidget} from "../models/widgets/popup.widget";
import {FIGProgressBarWidget} from "../models/widgets/progress-bar.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGSameLineWidget} from "../models/widgets/same-line.widget";
import {FIGSelectableWidget} from "../models/widgets/selectable.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGSliderWidget} from "../models/widgets/slider.widget";
import {FIGSpacingWidget} from "../models/widgets/spacing.widget";
import {FIGTabBarWidget} from "../models/widgets/tab-bar.widget";
import {FIGTabItemWidget} from "../models/widgets/tab-item.widget";
import {FIGTableWidget} from "../models/widgets/table.widget";
import {FIGTableColumnWidget} from "../models/widgets/table-column.widget";
import {FIGTableRowWidget} from "../models/widgets/table-row.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGTreeNodeWidget} from "../models/widgets/tree-node.widget";
import {FIGVerticalSliderWidget} from "../models/widgets/vertical-slider.widget";
import {type FIGWidget, FIGWidgetType} from "../models/widgets/widget";
import {FIGWindowWidget} from "../models/widgets/window.widget";
import type {FIGDocumentReader} from "./document.reader";
import type {FIGDocumentWriter} from "./document.writer";

export interface FIGSerializeProperty {
  readonly name: string;
  readonly version?: number;
  readonly optional?: true;
  readonly default?: any;
  readonly read?: (value: any) => any;
  readonly write?: (value: any) => any;
  readonly type?: "object" | "array";
  readonly innerType?: FIGSerializeProperty[];
}

export type FIGWidgetConstructors = Record<
  FIGWidgetType,
  {
    serializers?: FIGSerializeProperty[];
    new (options?: any): FIGWidget;
  }
>;
export type FIGWidgetPlaceholders = Record<FIGWidgetType, FIGWidget>;

export interface FIGDocumentParser {
  read(file: File): Promise<FIGDocument>;
  write(document: FIGDocument): Promise<File>;
}

export type Versioning = Record<string, number>;

export abstract class FIGBaseDocumentParser<R extends FIGDocumentReader, W extends FIGDocumentWriter>
  implements FIGDocumentParser
{
  public static readonly constructors: FIGWidgetConstructors = {
    // Layouts
    [FIGWidgetType.window]: FIGWindowWidget,
    [FIGWidgetType.childWindow]: FIGChildWindowWidget,
    [FIGWidgetType.modal]: FIGModalWidget,
    [FIGWidgetType.collapsingHeader]: FIGCollapsingHeaderWidget,
    [FIGWidgetType.tabBar]: FIGTabBarWidget,
    [FIGWidgetType.tabItem]: FIGTabItemWidget,
    [FIGWidgetType.table]: FIGTableWidget,
    [FIGWidgetType.tableRow]: FIGTableRowWidget,
    [FIGWidgetType.tableColumn]: FIGTableColumnWidget,
    [FIGWidgetType.group]: FIGGroupWidget,
    [FIGWidgetType.sameLine]: FIGSameLineWidget,
    [FIGWidgetType.newLine]: FIGNewLineWidget,
    [FIGWidgetType.spacing]: FIGSpacingWidget,
    [FIGWidgetType.dummy]: FIGDummyWidget,

    // Basics
    [FIGWidgetType.separator]: FIGSeparatorWidget,
    [FIGWidgetType.bullet]: FIGBulletWidget,
    [FIGWidgetType.text]: FIGTextWidget,
    [FIGWidgetType.button]: FIGButtonWidget,
    [FIGWidgetType.progressBar]: FIGProgressBarWidget,
    [FIGWidgetType.plot]: FIGPlotWidget,
    [FIGWidgetType.treeNode]: FIGTreeNodeWidget,
    [FIGWidgetType.selectable]: FIGSelectableWidget,
    [FIGWidgetType.popup]: FIGPopupWidget,
    [FIGWidgetType.menuBar]: FIGMenuBarWidget,
    [FIGWidgetType.menu]: FIGMenuWidget,
    [FIGWidgetType.menuItem]: FIGMenuItemWidget,

    // Forms / Inputs
    [FIGWidgetType.label]: FIGLabelWidget,
    [FIGWidgetType.inputText]: FIGInputTextWidget,
    [FIGWidgetType.inputTextarea]: FIGInputTextareaWidget,
    [FIGWidgetType.inputNumber]: FIGInputNumberWidget,
    [FIGWidgetType.inputColorEdit]: FIGInputColorEditWidget,
    [FIGWidgetType.slider]: FIGSliderWidget,
    [FIGWidgetType.verticalSlider]: FIGVerticalSliderWidget,
    [FIGWidgetType.listbox]: FIGListBoxWidget,
    [FIGWidgetType.checkbox]: FIGCheckboxWidget,
    [FIGWidgetType.radio]: FIGRadioWidget,
    [FIGWidgetType.combo]: FIGComboWidget,

    // Blocs
    [FIGWidgetType.blocFor]: FIGBlocForWidget,
  };
  public static readonly placeholders: FIGWidgetPlaceholders = Object.fromEntries(
    Object.keys(this.constructors).map((type) => [
      +type as FIGWidgetType,
      new this.constructors[+type as FIGWidgetType](),
    ]),
  ) as Record<FIGWidgetType, FIGWidget>;

  // NOTE: sync version number with FIGDocument.
  public static readonly versioning: Versioning = {
    "0.0.0": 0,
    "0.1.0": 1,
    "0.2.0": 2,
  };

  protected readonly reader: R;
  protected readonly writer: W;

  protected constructor(reader: R, writer: W) {
    this.reader = reader;
    this.writer = writer;
  }

  public read(file: File): Promise<FIGDocument> {
    return this.reader.read(file);
  }

  public write(document: FIGDocument): Promise<File> {
    return this.writer.write(document);
  }
}
