import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWindowWidget} from "./window.widget";
import {FIGTextWidget} from "./text.widget";
import {FIGButtonWidget} from "./button.widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioWidget} from "./radio.widget";
import {FIGLabelWidget} from "./label.widget";
import {FIGComboWidget} from "./combo.widget";
import {FIGInputTextWidget} from "./input-text.widget";
import {FIGProgressBarWidget} from "./progress-bar.widget";
import {FIGInputNumberWidget} from "./input-number.widget";
import {FIGInputColorEditWidget} from "./input-color-edit.widget";
import {FIGCollapsingHeaderWidget} from "./collapsing-header.widget";
import {FIGBulletWidget} from "./bullet.widget";
import {FIGInputTextareaWidget} from "./input-textarea.widget";
import {FIGListBoxWidget} from "./listbox.widget";
import {FIGTabBarWidget} from "./tab-bar.widget";
import {FIGTabItemWidget} from "./tab-item.widget";
import {FIGPlotWidget} from "./plot.widget";
import {FIGVerticalSliderWidget} from "./vertical-slider.widget";
import {FIGSameLineWidget} from "./same-line.widget";
import {FIGNewLineWidget} from "./new-line.widget";
import {FIGSpacingWidget} from "./spacing.widget";
import {FIGDummyWidget} from "./dummy.widget";
import {FIGTreeNodeWidget} from "./tree-node.widget";
import {FIGSliderWidget} from "./slider.widget";
import {FIGChildWindowWidget} from "./child-window.widget";
import {FIGSelectableWidget} from "./selectable.widget";
import {FIGGroupWidget} from "./group.widget";
import {FIGModalWidget} from "./modal.widget";
import {FIGPopupWidget} from "./popup.widget";
import {FIGMenuItemWidget} from "./menu-item.widget";
import {FIGMenuWidget} from "./menu.widget";
import {FIGBlocForWidget} from "./bloc-for.widget";

export interface FIGWidgetBuilder {
  readonly type: FIGWidgetType;
  readonly title: string;
  readonly build: (id: number) => FIGWidget;
}

export class FIGWidgetFactory {

  public static readonly builders: FIGWidgetBuilder[] = [
    // Layouts
    {type: FIGWidgetType.window, title: 'Window', build: (id: number) => new FIGWindowWidget({label: `Window ${id}`})},
    {
      type: FIGWidgetType.childWindow,
      title: 'Child Window',
      build: (id: number) => new FIGChildWindowWidget({label: `Child Window ${id}`})
    },
    {
      type: FIGWidgetType.modal,
      title: 'Modal',
      build: (id: number) => new FIGModalWidget({label: `Modal ${id}`})
    },
    {
      type: FIGWidgetType.collapsingHeader,
      title: 'Collapsing Header',
      build: (id: number) => new FIGCollapsingHeaderWidget({label: `Header ${id}`})
    },
    {
      type: FIGWidgetType.tabBar,
      title: 'Tab Bar',
      build: (id: number) => new FIGTabBarWidget({label: `##TabBar${id}`})
    },
    {
      type: FIGWidgetType.tabItem,
      title: 'Tab Item',
      build: (id: number) => new FIGTabItemWidget({label: `Tab Item ${id}`})
    },
    {type: FIGWidgetType.group, title: 'Group', build: () => new FIGGroupWidget()},
    {type: FIGWidgetType.sameLine, title: 'SameLine', build: () => new FIGSameLineWidget()},
    {type: FIGWidgetType.newLine, title: 'NewLine', build: () => new FIGNewLineWidget()},
    {type: FIGWidgetType.spacing, title: 'Spacing', build: () => new FIGSpacingWidget()},
    {type: FIGWidgetType.dummy, title: 'Dummy', build: () => new FIGDummyWidget()},

    // Basics
    {type: FIGWidgetType.separator, title: 'Separator', build: () => new FIGSeparatorWidget()},
    {type: FIGWidgetType.bullet, title: 'Bullet', build: () => new FIGBulletWidget()},
    {type: FIGWidgetType.text, title: 'Text', build: () => new FIGTextWidget()},
    {type: FIGWidgetType.button, title: 'Button', build: () => new FIGButtonWidget()},
    {type: FIGWidgetType.progressBar, title: 'Progress Bar', build: () => new FIGProgressBarWidget()},
    {type: FIGWidgetType.plot, title: 'Plot', build: () => new FIGPlotWidget()},
    {type: FIGWidgetType.treeNode, title: 'Tree Node', build: () => new FIGTreeNodeWidget()},
    {type: FIGWidgetType.selectable, title: 'Selectable', build: () => new FIGSelectableWidget()},
    {type: FIGWidgetType.popup, title: 'Popup', build: () => new FIGPopupWidget()},
    {type: FIGWidgetType.menu, title: 'Menu', build: () => new FIGMenuWidget()},
    {type: FIGWidgetType.menuItem, title: 'Menu Item', build: () => new FIGMenuItemWidget()},

    // Forms / Inputs
    {type: FIGWidgetType.label, title: 'Label', build: () => new FIGLabelWidget()},
    {
      type: FIGWidgetType.inputText,
      title: 'Input Text',
      build: (id: number) => new FIGInputTextWidget({label: `Input Text ${id}`})
    },
    {
      type: FIGWidgetType.inputTextarea,
      title: 'Input Text Multiline',
      build: (id: number) => new FIGInputTextareaWidget({label: `##InputTextMultiline${id}`})
    },
    {
      type: FIGWidgetType.inputNumber,
      title: 'Input Number',
      build: (id: number) => new FIGInputNumberWidget({label: `Input Number ${id}`})
    },
    {
      type: FIGWidgetType.inputColorEdit,
      title: 'Color Edit',
      build: (id: number) => new FIGInputColorEditWidget({label: `Color Edit ${id}`})
    },
    {
      type: FIGWidgetType.slider,
      title: 'Slider / Drag',
      build: (id: number) => new FIGSliderWidget({label: `Slider ${id}`})
    },
    {
      type: FIGWidgetType.verticalSlider,
      title: 'VSlider',
      build: (id: number) => new FIGVerticalSliderWidget({label: `##VSlider${id}`})
    },
    {
      type: FIGWidgetType.listbox,
      title: 'ListBox',
      build: (id: number) => new FIGListBoxWidget({label: `ListBox ${id}`})
    },
    {
      type: FIGWidgetType.checkbox,
      title: 'Checkbox',
      build: (id: number) => new FIGCheckboxWidget({label: `Checkbox ${id}`})
    },
    {type: FIGWidgetType.radio, title: 'Radio', build: (id: number) => new FIGRadioWidget({label: `Radio ${id}`})},
    {type: FIGWidgetType.combo, title: 'Combo', build: (id: number) => new FIGComboWidget({label: `Combo ${id}`})},

    // Blocs
    {type: FIGWidgetType.blocFor, title: '@repeat N times', build: () => new FIGBlocForWidget()}
  ];
  public static readonly icons: string[] = FIGWidgetFactory.builders.map((builder) => FIGWidgetType[builder.type]);

  private static id: number = 0;

  public static createWidget(type: FIGWidgetType): FIGWidget | undefined {
    const builder: FIGWidgetBuilder | undefined = this.findBuilder(type);

    if (!builder) {
      return undefined;
    }
    return builder.build(++FIGWidgetFactory.id);
  }

  public static getTitle(type: FIGWidgetType): string | undefined {
    const builder: FIGWidgetBuilder | undefined = this.findBuilder(type);

    if (!builder) {
      return undefined;
    }
    return builder.title;
  }

  public static filterBetween(from: FIGWidgetType, to?: FIGWidgetType): FIGWidgetBuilder[] {
    // Use custom in-range filter as FIGWidgetType values are out-of-order.
    const builders: FIGWidgetBuilder[] = [];
    let inRange: boolean = false;

    for (const builder of this.builders) {
      if (builder.type === from) {
        inRange = true;
      }
      if (inRange) {
        builders.push(builder);
      }
      if (builder.type === to) {
        inRange = false;
      }
    }
    return builders;
  }

  private static findBuilder(type: FIGWidgetType): FIGWidgetBuilder | undefined {
    return this.builders.find((item) => item.type === type);
  }

}
