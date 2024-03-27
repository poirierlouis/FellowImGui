import {FIGTextOptions, FIGTextWidget} from "./text.widget";
import {FIGWindowOptions, FIGWindowWidget} from "./window.widget";
import {FIGWidget} from "./widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGButtonOptions, FIGButtonWidget} from "./button.widget";
import {FIGLabelOptions, FIGLabelWidget} from "./label.widget";
import {FIGInputTextOptions, FIGInputTextWidget} from "./input-text.widget";
import {FIGCheckboxOptions, FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioOptions, FIGRadioWidget} from "./radio.widget";
import {FIGComboOptions, FIGComboWidget} from "./combo.widget";
import {FIGProgressBarOptions, FIGProgressBarWidget} from "./progress-bar.widget";
import {FIGInputNumberOptions, FIGInputNumberWidget} from "./input-number.widget";
import {FIGInputColorEditOptions, FIGInputColorEditWidget} from "./input-color-edit.widget";
import {FIGCollapsingHeaderOptions, FIGCollapsingHeaderWidget} from "./collapsing-header.widget";
import {FIGBulletOptions, FIGBulletWidget} from "./bullet.widget";
import {FIGInputTextareaOptions, FIGInputTextareaWidget} from "./input-textarea.widget";
import {FIGListBoxOptions, FIGListBoxWidget} from "./listbox.widget";
import {FIGTabBarOptions, FIGTabBarWidget} from "./tab-bar.widget";
import {FIGTabItemOptions, FIGTabItemWidget} from "./tab-item.widget";
import {FIGPlotOptions, FIGPlotType, FIGPlotWidget} from "./plot.widget";
import {FIGVerticalSliderOptions, FIGVerticalSliderWidget} from "./vertical-slider.widget";
import {FIGSameLineWidget} from "./same-line.widget";
import {FIGNewLineWidget} from "./new-line.widget";
import {FIGSpacingWidget} from "./spacing.widget";
import {FIGDummyOptions, FIGDummyWidget} from "./dummy.widget";
import {FIGTreeNodeOptions, FIGTreeNodeWidget} from "./tree-node.widget";
import {FIGSliderOptions, FIGSliderWidget} from "./slider.widget";

export class FIGWidgetHelper {

  // Layouts
  public static createWindow(options?: FIGWindowOptions,
                             children: FIGWidget[] = []): FIGWindowWidget {
    const widget: FIGWindowWidget = new FIGWindowWidget(options);

    widget.children.push(...children);
    return widget;
  }

  public static createCollapsingHeader(options?: FIGCollapsingHeaderOptions, children: FIGWidget[] = []): FIGCollapsingHeaderWidget {
    const widget: FIGCollapsingHeaderWidget = new FIGCollapsingHeaderWidget(options);

    widget.children.push(...children);
    return widget;
  }

  public static createTabBar(options?: FIGTabBarOptions, tabs: FIGTabItemWidget[] = []): FIGTabBarWidget {
    const widget: FIGTabBarWidget = new FIGTabBarWidget(options);

    widget.children.push(...tabs);
    return widget;
  }

  public static createTabItem(options?: FIGTabItemOptions, children: FIGWidget[] = []): FIGTabItemWidget {
    const widget: FIGTabItemWidget = new FIGTabItemWidget(options);

    widget.children.push(...children);
    return widget;
  }

  public static createSameLine(): FIGSameLineWidget {
    return new FIGSameLineWidget();
  }

  public static createNewLine(): FIGNewLineWidget {
    return new FIGNewLineWidget();
  }

  public static createSpacing(): FIGSpacingWidget {
    return new FIGSpacingWidget();
  }

  public static createDummy(options?: FIGDummyOptions): FIGDummyWidget {
    return new FIGDummyWidget(options);
  }

  public static createSeparator(): FIGSeparatorWidget {
    return new FIGSeparatorWidget();
  }

  // Basics
  public static createBullet(options?: FIGBulletOptions): FIGBulletWidget {
    return new FIGBulletWidget(options);
  }

  public static createText(options?: FIGTextOptions): FIGTextWidget {
    return new FIGTextWidget(options);
  }

  public static createButton(options?: FIGButtonOptions): FIGButtonWidget {
    return new FIGButtonWidget(options);
  }

  public static createProgressBar(options?: FIGProgressBarOptions): FIGProgressBarWidget {
    return new FIGProgressBarWidget(options);
  }

  public static createPlotLines(options?: FIGPlotOptions): FIGPlotWidget {
    return new FIGPlotWidget({...options, plotType: FIGPlotType.lines});
  }

  public static createPlotHistogram(options?: FIGPlotOptions): FIGPlotWidget {
    return new FIGPlotWidget({...options, plotType: FIGPlotType.histogram});
  }

  public static createTreeNode(options?: FIGTreeNodeOptions, children: FIGWidget[] = []): FIGTreeNodeWidget {
    const widget: FIGTreeNodeWidget = new FIGTreeNodeWidget(options);

    widget.children.push(...children);
    return widget;
  }

  // Forms / Inputs
  public static createLabel(options?: FIGLabelOptions): FIGLabelWidget {
    return new FIGLabelWidget(options);
  }

  public static createInputText(options?: FIGInputTextOptions): FIGInputTextWidget {
    return new FIGInputTextWidget(options);
  }

  public static createInputTextarea(options?: FIGInputTextareaOptions): FIGInputTextareaWidget {
    return new FIGInputTextareaWidget(options);
  }

  public static createInputNumber(options?: FIGInputNumberOptions): FIGInputNumberWidget {
    return new FIGInputNumberWidget(options);
  }

  public static createInputColorEdit(options?: FIGInputColorEditOptions): FIGInputColorEditWidget {
    return new FIGInputColorEditWidget(options);
  }

  public static createListBox(options?: FIGListBoxOptions): FIGListBoxWidget {
    return new FIGListBoxWidget(options);
  }

  public static createSlider(options?: FIGSliderOptions): FIGSliderWidget {
    return new FIGSliderWidget(options);
  }

  public static createVerticalSlider(options?: FIGVerticalSliderOptions): FIGVerticalSliderWidget {
    return new FIGVerticalSliderWidget(options);
  }

  public static createCheckbox(options?: FIGCheckboxOptions): FIGCheckboxWidget {
    return new FIGCheckboxWidget(options);
  }

  public static createRadio(options?: FIGRadioOptions): FIGRadioWidget {
    return new FIGRadioWidget(options);
  }

  public static createCombo(options?: FIGComboOptions): FIGComboWidget {
    return new FIGComboWidget(options);
  }

}
