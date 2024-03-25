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
    {type: FIGWidgetType.separator, title: 'Separator', build: () => new FIGSeparatorWidget()},

    // Basics
    {type: FIGWidgetType.bullet, title: 'Bullet', build: () => new FIGBulletWidget()},
    {type: FIGWidgetType.text, title: 'Text', build: () => new FIGTextWidget()},
    {type: FIGWidgetType.button, title: 'Button', build: () => new FIGButtonWidget()},
    {type: FIGWidgetType.progressBar, title: 'Progress Bar', build: () => new FIGProgressBarWidget()},
    {type: FIGWidgetType.plot, title: 'Plot', build: () => new FIGPlotWidget()},

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
  ];
  public static readonly icons: string[] = FIGWidgetFactory.builders.map((builder) => FIGWidgetType[builder.type]);

  private static id: number = 0;

  public static isContainer(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.window ||
      type === FIGWidgetType.collapsingHeader ||
      type === FIGWidgetType.tabBar ||
      type === FIGWidgetType.tabItem;
  }

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
    return this.builders.filter((builder) => {
      return (to !== undefined) ? builder.type >= from && builder.type <= to : builder.type >= from;
    });
  }

  private static findBuilder(type: FIGWidgetType): FIGWidgetBuilder | undefined {
    return this.builders.find((item) => item.type === type);
  }

}
