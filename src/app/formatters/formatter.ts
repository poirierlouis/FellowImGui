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

  protected readonly options: FIGFormatterOptions = {
    indent: ''
  };

  private readonly formatters: FIGFormatterItem[] = [
    // Layouts
    {type: FIGWidgetType.window, fmt: this.formatWindow.bind(this)},
    {type: FIGWidgetType.separator, fmt: this.formatSeparator.bind(this)},

    // Basics
    {type: FIGWidgetType.text, fmt: this.formatText.bind(this)},
    {type: FIGWidgetType.button, fmt: this.formatButton.bind(this)},
    {type: FIGWidgetType.progressBar, fmt: this.formatProgressBar.bind(this)},

    // Forms / Inputs
    {type: FIGWidgetType.label, fmt: this.formatLabel.bind(this)},
    {type: FIGWidgetType.inputText, fmt: this.formatInputText.bind(this)},
    {type: FIGWidgetType.inputNumber, fmt: this.formatInputNumber.bind(this)},
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

  protected formatWidget(widget: FIGWidget): void {
    const formatter: FIGFormatterItem | undefined = this.findFormatter(widget.type);

    if (!formatter) {
      this.append(`-- ${FIGWidgetType[widget.type]} formatter for '${this.language}' is not implemented!`);
      this.append('');
      return;
    }
    formatter.fmt(widget);
    this.append('');
  }

  protected formatString(text: string): string {
    return `"${text.replaceAll(/"/g, '\\"')}"`;
  }

  protected formatVar(name: string, type: FIGWidgetType): string {
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

  protected pushIndent(): void {
    this.indent += this.options.indent;
  }

  protected popIndent(): void {
    this.indent = this.indent.substring(0, this.indent.length - this.options.indent.length);
  }

  // Layouts
  protected abstract formatWindow(widget: FIGWindowWidget): void;
  protected abstract formatSeparator(widget: FIGSeparatorWidget): void;

  // Basics
  protected abstract formatTooltip(widget: FIGWithTooltip): void;
  protected abstract formatText(widget: FIGTextWidget): void;
  protected abstract formatButton(widget: FIGButtonWidget): void;
  protected abstract formatProgressBar(widget: FIGProgressBarWidget): void;

  // Forms / Inputs
  protected abstract formatLabel(widget: FIGLabelWidget): void;
  protected abstract formatInputText(widget: FIGInputTextWidget): void;
  protected abstract formatInputNumber(widget: FIGInputNumberWidget): void;
  protected abstract formatCheckbox(widget: FIGCheckboxWidget): void;
  protected abstract formatRadio(widget: FIGRadioWidget): void;
  protected abstract formatCombo(widget: FIGComboWidget): void;

  private findFormatter(type: FIGWidgetType): FIGFormatterItem | undefined {
    return this.formatters.find((item) => item.type === type);
  }
}
