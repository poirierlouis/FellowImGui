import {FIGDocument} from "../models/document";
import {FIGWindowWidget} from "../models/widgets/window.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGButtonWidget} from "../models/widgets/button.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGWidget, FIGWidgetType} from "../models/widgets/widget";
import {FIGWithTooltip} from "../models/widgets/with-tooltip.widget";
import {sanitizeVar, toCamelCase, toSnakeCase} from "../models/string";
import {FIGProgressBarWidget} from "../models/widgets/progress-bar.widget";
import {FIGInputNumberWidget} from "../models/widgets/input-number.widget";
import {FIGInputColorEditWidget} from "../models/widgets/input-color-edit.widget";
import {FIGCollapsingHeaderWidget} from "../models/widgets/collapsing-header.widget";
import {FIGBulletWidget} from "../models/widgets/bullet.widget";
import {FIGInputTextareaWidget} from "../models/widgets/input-textarea.widget";
import {FIGListBoxWidget} from "../models/widgets/listbox.widget";
import {FIGTabBarWidget} from "../models/widgets/tab-bar.widget";
import {FIGTabItemWidget} from "../models/widgets/tab-item.widget";
import {FIGPlotWidget} from "../models/widgets/plot.widget";
import {FIGVerticalSliderWidget} from "../models/widgets/vertical-slider.widget";
import {FIGSameLineWidget} from "../models/widgets/same-line.widget";
import {FIGNewLineWidget} from "../models/widgets/new-line.widget";
import {FIGSpacingWidget} from "../models/widgets/spacing.widget";
import {FIGDummyWidget} from "../models/widgets/dummy.widget";
import {FIGTreeNodeWidget} from "../models/widgets/tree-node.widget";
import {FIGSliderWidget} from "../models/widgets/slider.widget";
import {FIGChildWindowWidget} from "../models/widgets/child-window.widget";
import {FIGSelectableWidget} from "../models/widgets/selectable.widget";
import {FIGGroupWidget} from "../models/widgets/group.widget";

interface FIGFormatterItem {
  readonly type: FIGWidgetType;
  readonly fmt: (widget: any) => void;
}

interface FIGFormatterOptions {
  indent: string;
}

export type FIGFormatterLanguage = 'Lua - sol2';

export enum CaseStyle {
  snake_case,
  camelCase
}

export abstract class FIGFormatter {

  protected readonly notSupported: FIGWidgetType[] = [];

  protected readonly options: FIGFormatterOptions = {
    indent: ''
  };

  private readonly formatters: FIGFormatterItem[] = [
    // Layouts
    {type: FIGWidgetType.window, fmt: this.formatWindow.bind(this)},
    {type: FIGWidgetType.childWindow, fmt: this.formatChildWindow.bind(this)},
    {type: FIGWidgetType.collapsingHeader, fmt: this.formatCollapsingHeader.bind(this)},
    {type: FIGWidgetType.tabBar, fmt: this.formatTabBar.bind(this)},
    {type: FIGWidgetType.tabItem, fmt: this.formatTabItem.bind(this)},
    {type: FIGWidgetType.group, fmt: this.formatGroup.bind(this)},
    {type: FIGWidgetType.sameLine, fmt: this.formatSameLine.bind(this)},
    {type: FIGWidgetType.newLine, fmt: this.formatNewLine.bind(this)},
    {type: FIGWidgetType.spacing, fmt: this.formatSpacing.bind(this)},
    {type: FIGWidgetType.dummy, fmt: this.formatDummy.bind(this)},
    {type: FIGWidgetType.separator, fmt: this.formatSeparator.bind(this)},

    // Basics
    {type: FIGWidgetType.bullet, fmt: this.formatBullet.bind(this)},
    {type: FIGWidgetType.text, fmt: this.formatText.bind(this)},
    {type: FIGWidgetType.button, fmt: this.formatButton.bind(this)},
    {type: FIGWidgetType.progressBar, fmt: this.formatProgressBar.bind(this)},
    {type: FIGWidgetType.plot, fmt: this.formatPlot.bind(this)},
    {type: FIGWidgetType.treeNode, fmt: this.formatTreeNode.bind(this)},
    {type: FIGWidgetType.selectable, fmt: this.formatSelectable.bind(this)},

    // Forms / Inputs
    {type: FIGWidgetType.label, fmt: this.formatLabel.bind(this)},
    {type: FIGWidgetType.inputText, fmt: this.formatInputText.bind(this)},
    {type: FIGWidgetType.inputTextarea, fmt: this.formatInputTextarea.bind(this)},
    {type: FIGWidgetType.inputNumber, fmt: this.formatInputNumber.bind(this)},
    {type: FIGWidgetType.inputColorEdit, fmt: this.formatInputColorEdit.bind(this)},
    {type: FIGWidgetType.slider, fmt: this.formatSlider.bind(this)},
    {type: FIGWidgetType.verticalSlider, fmt: this.formatVerticalSlider.bind(this)},
    {type: FIGWidgetType.listbox, fmt: this.formatListBox.bind(this)},
    {type: FIGWidgetType.checkbox, fmt: this.formatCheckbox.bind(this)},
    {type: FIGWidgetType.radio, fmt: this.formatRadio.bind(this)},
    {type: FIGWidgetType.combo, fmt: this.formatCombo.bind(this)},
  ];

  private indent: string = '';
  private lines: string = '';

  protected constructor(public readonly language: FIGFormatterLanguage,
                        protected readonly caseStyle: CaseStyle) {
  }

  public format(document: FIGDocument): string {
    this.lines = '';
    for (const container of document.root) {
      this.formatWidget(container);
    }
    const lines: string = this.lines;

    this.lines = '';
    return lines;
  }

  public isSupported(type: FIGWidgetType): boolean {
    return !this.notSupported.includes(type);
  }

  protected formatWidget(widget: FIGWidget): void {
    const formatter: FIGFormatterItem | undefined = this.findFormatter(widget.type);

    if (!formatter) {
      this.append(`-- ${FIGWidgetType[widget.type]} formatter for '${this.language}' is not implemented!`);
      this.append('');
      return;
    }
    if (!this.isSupported(widget.type)) {
      this.append(`-- ${FIGWidgetType[widget.type]} is not supported by '${this.language}'!`);
      this.append('');
      return;
    }
    formatter.fmt(widget);
    this.append('');
  }

  protected formatString(text: string): string {
    let format: string = text;

    format = format.replaceAll(/\\/g, '\\\\');
    format = format.replaceAll(/"/g, '\\"');
    format = format.replaceAll(/\f/g, '\\f');
    format = format.replaceAll(/\n/g, '\\n');
    format = format.replaceAll(/\r/g, '\\r');
    format = format.replaceAll(/\t/g, '\\t');
    return `"${format}"`;
  }

  protected formatVar(name: string, _type: FIGWidgetType): string {
    name = sanitizeVar(name);
    if (this.caseStyle === CaseStyle.snake_case) {
      return toSnakeCase(name);
    } else {
      return toCamelCase(name);
    }
  }

  protected append(line: string): void {
    this.lines += `${this.indent}${line}\n`;
  }

  protected appendIndent(line: string): void {
    this.lines += `${this.indent + this.options.indent}${line}\n`;
  }

  protected removeLastNewLine(): void {
    this.lines = this.lines.substring(0, this.lines.length - (this.indent.length + 1));
  }

  protected pushIndent(): void {
    this.indent += this.options.indent;
  }

  protected popIndent(): void {
    this.indent = this.indent.substring(0, this.indent.length - this.options.indent.length);
  }

  protected abstract formatFlags<T>(flags: number, flagsList: T[], flagsType: any, flagName: string): string;

  // Layouts
  protected abstract formatWindow(widget: FIGWindowWidget): void;
  protected abstract formatChildWindow(widget: FIGChildWindowWidget): void;
  protected abstract formatCollapsingHeader(widget: FIGCollapsingHeaderWidget): void;
  protected abstract formatTabBar(widget: FIGTabBarWidget): void;
  protected abstract formatTabItem(widget: FIGTabItemWidget): void;
  protected abstract formatGroup(widget: FIGGroupWidget): void;
  protected abstract formatSameLine(widget: FIGSameLineWidget): void;
  protected abstract formatNewLine(widget: FIGNewLineWidget): void;
  protected abstract formatSpacing(widget: FIGSpacingWidget): void;
  protected abstract formatDummy(widget: FIGDummyWidget): void;
  protected abstract formatSeparator(widget: FIGSeparatorWidget): void;

  // Basics
  protected abstract formatTooltip(widget: FIGWithTooltip): void;
  protected abstract formatBullet(widget: FIGBulletWidget): void;
  protected abstract formatText(widget: FIGTextWidget): void;
  protected abstract formatButton(widget: FIGButtonWidget): void;
  protected abstract formatProgressBar(widget: FIGProgressBarWidget): void;
  protected abstract formatPlot(widget: FIGPlotWidget): void;
  protected abstract formatTreeNode(widget: FIGTreeNodeWidget): void;
  protected abstract formatSelectable(widget: FIGSelectableWidget): void;

  // Forms / Inputs
  protected abstract formatLabel(widget: FIGLabelWidget): void;
  protected abstract formatInputText(widget: FIGInputTextWidget): void;
  protected abstract formatInputTextarea(widget: FIGInputTextareaWidget): void;
  protected abstract formatInputNumber(widget: FIGInputNumberWidget): void;
  protected abstract formatInputColorEdit(widget: FIGInputColorEditWidget): void;
  protected abstract formatSlider(widget: FIGSliderWidget): void;
  protected abstract formatVerticalSlider(widget: FIGVerticalSliderWidget): void;
  protected abstract formatListBox(widget: FIGListBoxWidget): void;
  protected abstract formatCheckbox(widget: FIGCheckboxWidget): void;
  protected abstract formatRadio(widget: FIGRadioWidget): void;
  protected abstract formatCombo(widget: FIGComboWidget): void;

  private findFormatter(type: FIGWidgetType): FIGFormatterItem | undefined {
    return this.formatters.find((item) => item.type === type);
  }
}
