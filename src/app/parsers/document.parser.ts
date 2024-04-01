import {FIGDocument} from "../models/document";
import {FIGDocumentReader} from "./document.reader";
import {FIGDocumentWriter} from "./document.writer";
import {FIGWidgetType} from "../models/widgets/widget";
import {FIGWindowWidget} from "../models/widgets/window.widget";
import {FIGChildWindowWidget} from "../models/widgets/child-window.widget";
import {FIGModalWidget} from "../models/widgets/modal.widget";
import {FIGCollapsingHeaderWidget} from "../models/widgets/collapsing-header.widget";
import {FIGTabBarWidget} from "../models/widgets/tab-bar.widget";
import {FIGTabItemWidget} from "../models/widgets/tab-item.widget";
import {FIGGroupWidget} from "../models/widgets/group.widget";
import {FIGSameLineWidget} from "../models/widgets/same-line.widget";
import {FIGNewLineWidget} from "../models/widgets/new-line.widget";
import {FIGSpacingWidget} from "../models/widgets/spacing.widget";
import {FIGDummyWidget} from "../models/widgets/dummy.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGBulletWidget} from "../models/widgets/bullet.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGButtonWidget} from "../models/widgets/button.widget";
import {FIGProgressBarWidget} from "../models/widgets/progress-bar.widget";
import {FIGPlotWidget} from "../models/widgets/plot.widget";
import {FIGTreeNodeWidget} from "../models/widgets/tree-node.widget";
import {FIGSelectableWidget} from "../models/widgets/selectable.widget";
import {FIGPopupWidget} from "../models/widgets/popup.widget";
import {FIGMenuWidget} from "../models/widgets/menu.widget";
import {FIGMenuItemWidget} from "../models/widgets/menu-item.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGInputTextareaWidget} from "../models/widgets/input-textarea.widget";
import {FIGInputNumberWidget} from "../models/widgets/input-number.widget";
import {FIGInputColorEditWidget} from "../models/widgets/input-color-edit.widget";
import {FIGSliderWidget} from "../models/widgets/slider.widget";
import {FIGVerticalSliderWidget} from "../models/widgets/vertical-slider.widget";
import {FIGListBoxWidget} from "../models/widgets/listbox.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGBlocForWidget} from "../models/widgets/bloc-for.widget";

export interface FIGSerializeProperty {
  readonly name: string;
  readonly version?: number;
  readonly optional?: true;
  readonly default?: any;
  readonly type?: 'object' | 'array';
  readonly innerType?: FIGSerializeProperty[];
}

export interface FIGSerializeBind {
  readonly type: FIGWidgetType;
  readonly constructor: any;
}

export interface FIGDocumentParser {

  read(file: File): Promise<FIGDocument>;
  write(document: FIGDocument): Promise<File>;

}

export interface Versioning {
  [key: string]: number;
}

export abstract class FIGBaseDocumentParser<R extends FIGDocumentReader, W extends FIGDocumentWriter> implements FIGDocumentParser {
  public static readonly binders: FIGSerializeBind[] = [
    // Layouts
    {type: FIGWidgetType.window, constructor: FIGWindowWidget},
    {type: FIGWidgetType.childWindow, constructor: FIGChildWindowWidget},
    {type: FIGWidgetType.modal, constructor: FIGModalWidget},
    {type: FIGWidgetType.collapsingHeader, constructor: FIGCollapsingHeaderWidget},
    {type: FIGWidgetType.tabBar, constructor: FIGTabBarWidget},
    {type: FIGWidgetType.tabItem, constructor: FIGTabItemWidget},
    {type: FIGWidgetType.group, constructor: FIGGroupWidget},
    {type: FIGWidgetType.sameLine, constructor: FIGSameLineWidget},
    {type: FIGWidgetType.newLine, constructor: FIGNewLineWidget},
    {type: FIGWidgetType.spacing, constructor: FIGSpacingWidget},
    {type: FIGWidgetType.dummy, constructor: FIGDummyWidget},
    {type: FIGWidgetType.separator, constructor: FIGSeparatorWidget},

    // Basics
    {type: FIGWidgetType.bullet, constructor: FIGBulletWidget},
    {type: FIGWidgetType.text, constructor: FIGTextWidget},
    {type: FIGWidgetType.button, constructor: FIGButtonWidget},
    {type: FIGWidgetType.progressBar, constructor: FIGProgressBarWidget},
    {type: FIGWidgetType.plot, constructor: FIGPlotWidget},
    {type: FIGWidgetType.treeNode, constructor: FIGTreeNodeWidget},
    {type: FIGWidgetType.selectable, constructor: FIGSelectableWidget},
    {type: FIGWidgetType.popup, constructor: FIGPopupWidget},
    {type: FIGWidgetType.menu, constructor: FIGMenuWidget},
    {type: FIGWidgetType.menuItem, constructor: FIGMenuItemWidget},

    // Forms / Inputs
    {type: FIGWidgetType.label, constructor: FIGLabelWidget},
    {type: FIGWidgetType.inputText, constructor: FIGInputTextWidget},
    {type: FIGWidgetType.inputTextarea, constructor: FIGInputTextareaWidget},
    {type: FIGWidgetType.inputNumber, constructor: FIGInputNumberWidget},
    {type: FIGWidgetType.inputColorEdit, constructor: FIGInputColorEditWidget},
    {type: FIGWidgetType.slider, constructor: FIGSliderWidget},
    {type: FIGWidgetType.verticalSlider, constructor: FIGVerticalSliderWidget},
    {type: FIGWidgetType.listbox, constructor: FIGListBoxWidget},
    {type: FIGWidgetType.checkbox, constructor: FIGCheckboxWidget},
    {type: FIGWidgetType.radio, constructor: FIGRadioWidget},
    {type: FIGWidgetType.combo, constructor: FIGComboWidget},

    // Blocs
    {type: FIGWidgetType.blocFor, constructor: FIGBlocForWidget}
  ];

  // NOTE: sync version number with FIGDocument.
  public static readonly versioning: Versioning = {
    '0.0.0': 0,
    '0.1.0': 1
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
