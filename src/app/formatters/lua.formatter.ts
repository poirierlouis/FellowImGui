import {FIGButtonWidget, FIGDir} from "../models/widgets/button.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGInputTextFlags, FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGWindowWidget} from "../models/widgets/window.widget";
import {CaseStyle, FIGFormatter} from "./formatter";
import {FIGWithTooltip} from "../models/widgets/with-tooltip.widget";
import {Color, Vector2} from "../models/math";
import {capitalize} from "../models/string";
import {FIGProgressBarWidget} from "../models/widgets/progress-bar.widget";
import {FIGInputNumberType, FIGInputNumberWidget} from "../models/widgets/input-number.widget";
import {FIGInputColorEditWidget} from "../models/widgets/input-color-edit.widget";
import {FIGCollapsingHeaderFlags, FIGCollapsingHeaderWidget} from "../models/widgets/collapsing-header.widget";
import {FIGBulletWidget} from "../models/widgets/bullet.widget";
import {FIGInputTextareaWidget} from "../models/widgets/input-textarea.widget";

export class FIGLuaFormatter extends FIGFormatter {
  constructor() {
    super('Lua - sol2', CaseStyle.camelCase);
    this.options.indent = '  ';
  }

  private static formatColor(color: Color): string {
    return `${color.r}, ${color.g}, ${color.b}, ${color.a}`;
  }

  private static formatDir(arrow: FIGDir): string {
    return `ImGuiDir.${capitalize(FIGDir[arrow])}`;
  }

  // Layouts
  protected override formatWindow(widget: FIGWindowWidget): void {
    this.append(`ImGui.SetNextWindowSize(${widget.size.width}, ${widget.size.height})`);
    this.append(`if not ImGui.Begin(${this.formatString(widget.label)}) then`);
    this.appendIndent('ImGui.End()');
    this.appendIndent('return');
    this.append('end');
    this.append('');
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.End()');
  }

  protected override formatCollapsingHeader(widget: FIGCollapsingHeaderWidget): void {
    let varFlags: string = '';

    if (widget.flags !== 0) {
      varFlags = ', ';
      varFlags += FIGCollapsingHeaderWidget.flags
        .filter((flag) => (widget.flags & flag) === flag)
        .map((flag) => FIGCollapsingHeaderFlags[flag])
        .map((name) => `ImGuiTreeNodeFlags.${name}`)
        .join(' | ');
    }
    this.append(`if ImGui.CollapsingHeader(${this.formatString(widget.label)}${varFlags}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    if (widget.children.length > 0) {
      this.removeLastNewLine();
    }
    this.popIndent();
    this.append('end');
  }

  protected override formatSeparator(widget: FIGSeparatorWidget): void {
    this.append('ImGui.Separator()');
  }

  // Basics
  protected formatTooltip(widget: FIGWithTooltip): void {
    if (!widget.tooltip) {
      return;
    }
    this.append(`if ImGui.IsItemHovered() then`);
    this.appendIndent(`ImGui.SetTooltip(${this.formatString(widget.tooltip)})`);
    this.append(`end`);
  }

  protected override formatBullet(_widget: FIGBulletWidget): void {
    this.append('ImGui.Bullet()');
  }

  protected override formatText(widget: FIGTextWidget): void {
    if (!widget.hasBullet && !widget.isDisabled && !widget.color && !widget.isWrapped) {
      this.append(`ImGui.Text(${this.formatString(widget.text)})`);
    } else if (widget.hasBullet && !widget.isWrapped) {
      if (widget.isDisabled) {
        this.append('local color = ImGui.GetStyleColorVec4(ImGuiCol.TextDisabled)');
        this.append(`ImGui.PushStyleColor(ImGuiCol.Text, color[1], color[2], color[3], color[4])`);
        this.append('ImGui.Bullet()');
        this.append('ImGui.PopStyleColor()');
        this.append(`ImGui.TextDisabled(${this.formatString(widget.text)})`);
      } else if (widget.color) {
        this.append(`ImGui.PushStyleColor(ImGuiCol.Text, ${FIGLuaFormatter.formatColor(widget.color)})`);
        this.append('ImGui.Bullet()');
        this.append('ImGui.PopStyleColor()');
        this.append(`ImGui.TextColored(${FIGLuaFormatter.formatColor(widget.color)}, ${this.formatString(widget.text)})`);
      } else {
        this.append(`ImGui.BulletText(${this.formatString(widget.text)})`);
      }
    } else if (widget.isDisabled && !widget.isWrapped) {
      this.append(`ImGui.TextDisabled(${this.formatString(widget.text)})`);
    } else if (widget.color && !widget.isWrapped) {
      this.append(`ImGui.TextColored(${FIGLuaFormatter.formatColor(widget.color)}, ${this.formatString(widget.text)})`);
    } else {
      if (widget.isDisabled) {
        this.append('local color = ImGui.GetStyleColorVec4(ImGuiCol.TextDisabled)');
        this.append(`ImGui.PushStyleColor(ImGuiCol.Text, color[1], color[2], color[3], color[4])`);
      } else if (widget.color) {
        this.append(`ImGui.PushStyleColor(ImGuiCol.Text, ${FIGLuaFormatter.formatColor(widget.color)})`);
      }
      if (widget.hasBullet) {
        this.append('ImGui.Bullet()');
      }
      this.append(`ImGui.TextWrapped(${this.formatString(widget.text)})`);
      if (widget.isDisabled || widget.color) {
        this.append('ImGui.PopStyleColor()');
      }
    }
    this.formatTooltip(widget);
  }

  protected override formatButton(widget: FIGButtonWidget): void {
    const varClicked: string = this.formatVar(`${widget.label} clicked`, widget.type);
    const varDef: string = `local ${varClicked} = `;

    if (widget.isSmall) {
      this.append(`${varDef}ImGui.SmallButton(${this.formatString(widget.label)})`);
    } else if (widget.arrow !== FIGDir.none) {
      this.append(`${varDef}ImGui.ArrowButton(${this.formatString(widget.label)}, ${FIGLuaFormatter.formatDir(widget.arrow)})`);
    } else {
      let size: string = '';

      if (widget.isFill) {
        size = ', -1, 0';
      }
      this.append(`${varDef}ImGui.Button(${this.formatString(widget.label)}${size})`);
    }
    this.formatTooltip(widget);
  }

  protected override formatProgressBar(widget: FIGProgressBarWidget): void {
    const progression: string = `${(widget.value * 100.0).toFixed(0)}%`;
    const size: Vector2 = {x: 0, y: 0};

    if (widget.isFill) {
      size.x = -1;
    }
    this.append(`ImGui.ProgressBar(${widget.value}, ${size.x}, ${size.y}, ${this.formatString(progression)})`);
    let varShow: string = this.formatVar(`${widget.label ?? ''} show tooltip`, widget.type);

    if (widget.tooltip && widget.label && !widget.isFill) {
      this.append(`local ${varShow} = ImGui.IsItemHovered()`);
    } else if (widget.tooltip) {
      varShow = 'ImGui.IsItemHovered()';
    }
    if (widget.label && !widget.isFill) {
      this.append(`ImGui.SameLine()`);
      this.append(`ImGui.Text(${this.formatString(widget.label)})`);
      if (widget.tooltip) {
        this.append(`${varShow} = ${varShow} or ImGui.IsItemHovered()`);
      }
    }
    if (widget.tooltip) {
      this.append(`if ${varShow} then`);
      this.appendIndent(`ImGui.SetTooltip(${this.formatString(widget.tooltip)})`);
      this.append('end');
    }
  }

  // Forms / Inputs
  protected override formatLabel(widget: FIGLabelWidget): void {
    this.append(`ImGui.LabelText("${widget.label}", "${widget.value}")`);
    this.formatTooltip(widget);
  }

  protected override formatInputText(widget: FIGInputTextWidget): void {
    const varText: string = this.formatVar(`${widget.label} text`, widget.type);
    const varSelected: string = this.formatVar(`${widget.label} selected`, widget.type);
    const varDef: string = `${varText}, ${varSelected}`;
    let varFlags: string = '';

    if (widget.flags !== 0) {
      varFlags = ', ';
      varFlags += FIGInputTextWidget.flags
        .filter((flag) => (widget.flags & flag) === flag)
        .map((flag) => FIGInputTextFlags[flag])
        .map((name) => `ImGuiInputTextFlags.${name}`)
        .join(' | ');
    }

    this.append(`local ${varText} = "", ${varSelected}`);
    if (!widget.hint) {
      this.append(`${varDef} = ImGui.InputText(${this.formatString(widget.label)}, ${varText}, ${widget.bufferSize}${varFlags})`);
    } else {
      this.append(`${varDef} = ImGui.InputTextWithHint(${this.formatString(widget.label)}, ${this.formatString(widget.hint)}, ${varText}, ${widget.bufferSize}${varFlags})`);
    }
    this.formatTooltip(widget);
  }

  protected override formatInputTextarea(widget: FIGInputTextareaWidget): void {
    const varText: string = this.formatVar(`${widget.label} text`, widget.type);
    const varSelected: string = this.formatVar(`${widget.label} selected`, widget.type);
    const varSize: string = `-1, ${widget.linesSize} * ImGui.GetTextLineHeight()`;
    const varDef: string = `${varText}, ${varSelected}`;
    let varFlags: string = '';

    if (widget.flags !== 0) {
      varFlags = ', ';
      varFlags += FIGInputTextWidget.flags
        .filter((flag) => (widget.flags & flag) === flag)
        .map((flag) => FIGInputTextFlags[flag])
        .map((name) => `ImGuiInputTextFlags.${name}`)
        .join(' + ');
    }

    this.append(`local ${varText} = "", ${varSelected}`);
    this.append(`${varDef} = ImGui.InputTextMultiline(${this.formatString(widget.label)}, ${varText}, ${widget.bufferSize}, ${varSize}${varFlags})`);
    this.formatTooltip(widget);
  }

  protected override formatInputNumber(widget: FIGInputNumberWidget): void {
    const size: number = FIGInputNumberWidget.getArraySize(widget.dataType);
    const varValue: string = this.formatVar(`${widget.label} value${size > 0 ? 's' : ''}`, widget.type);
    const varUsed: string = this.formatVar(`${widget.label} used`, widget.type);
    const varStep: string = widget.step.toString();
    const varStepFast: string = widget.stepFast.toString();
    const varFormat: string = this.formatString(widget.format);
    const args: string[] = [this.formatString(widget.label), varValue];
    let fn: string;

    switch (widget.dataType) {
      case FIGInputNumberType.int:
        fn = 'ImGui.InputInt';
        args.push(varStep, varStepFast);
        break;
      case FIGInputNumberType.int2:
        fn = 'ImGui.InputInt2';
        break;
      case FIGInputNumberType.int3:
        fn = 'ImGui.InputInt3';
        break;
      case FIGInputNumberType.int4:
        fn = 'ImGui.InputInt4';
        break;
      case FIGInputNumberType.float:
        fn = 'ImGui.InputFloat';
        args.push(varStep, varStepFast, varFormat);
        break;
      case FIGInputNumberType.float2:
        fn = 'ImGui.InputFloat2';
        args.push(varFormat);
        break;
      case FIGInputNumberType.float3:
        fn = 'ImGui.InputFloat3';
        args.push(varFormat);
        break;
      case FIGInputNumberType.float4:
        fn = 'ImGui.InputFloat4';
        args.push(varFormat);
        break;
      case FIGInputNumberType.double:
        fn = 'ImGui.InputDouble';
        args.push(varStep, varStepFast, varFormat);
        break;
    }
    const precision: number | undefined = FIGInputNumberWidget.getPrecision(widget);
    const isInteger: boolean = FIGInputNumberWidget.isInteger(widget.dataType);
    let value: string;

    if (size === 0) {
      const number: number = widget.value as number;

      value = isInteger ? number.toString() : number.toFixed(precision);
    } else {
      const numbers: number[] = widget.value as number[];

      value = numbers.map((item) => isInteger ? item.toString() : item.toFixed(precision)).join(', ');
      value = `{${value}}`;
    }
    this.append(`local ${varValue} = ${value}, ${varUsed}`);
    this.append(`${varValue}, ${varUsed} = ${fn}(${args.join(', ')})`);
    this.formatTooltip(widget);
  }

  protected override formatInputColorEdit(widget: FIGInputColorEditWidget): void {
    const text: string = this.formatString(widget.label);
    const varColor: string = this.formatVar(`${widget.label} color`, widget.type);
    const varUsed: string = this.formatVar(`${widget.label} used`, widget.type);
    let value: string = `${widget.color.r}, ${widget.color.g}, ${widget.color.b}`;

    if (widget.withAlpha) {
      value += `, ${widget.color.a}`;
    }
    value = `{${value}}`;
    this.append(`local ${varColor} = ${value}, ${varUsed}`);
    if (!widget.withAlpha) {
      this.append(`${varColor}, ${varUsed} = ImGui.ColorEdit3(${text}, ${varColor})`);
    } else {
      this.append(`${varColor}, ${varUsed} = ImGui.ColorEdit4(${text}, ${varColor})`);
    }
    this.formatTooltip(widget);
  }

  protected override formatCheckbox(widget: FIGCheckboxWidget): void {
    const varValue: string = this.formatVar(`${widget.label} value`, widget.type);
    const varPressed: string = this.formatVar(`${widget.label} pressed`, widget.type);

    this.append(`local ${varValue} = false, ${varPressed}`);
    this.append(`${varValue}, ${varPressed} = ImGui.Checkbox(${this.formatString(widget.label)}, ${varValue})`);
    this.formatTooltip(widget);
  }

  protected override formatRadio(widget: FIGRadioWidget): void {
    const group: FIGRadioWidget[] = widget.parent!.filter<FIGRadioWidget>((item) => FIGRadioWidget.filterByGroupId(item, widget.groupId));
    const varValue: string = this.formatVar(`${widget.groupId} value`, widget.type);

    if (group[0].uuid === widget.uuid) {
      this.append(`local ${varValue} = ${widget.index}`);
    }
    const varPressed: string = this.formatVar(`${widget.label} pressed`, widget.type);
    const varDef: string = `${varValue}, ${varPressed} = `;

    this.append(`${varDef}ImGui.RadioButton(${this.formatString(widget.label)}, ${varValue}, ${widget.index})`);
    this.formatTooltip(widget);
  }

  protected override formatCombo(widget: FIGComboWidget): void {
    const varCurrentItem: string = this.formatVar(`${widget.label} current item`, widget.type);
    const varClicked: string = this.formatVar(`${widget.label} clicked`, widget.type);
    const items: string = widget.items.map((item) => this.formatString(item)).join(', ');

    this.append(`local ${varCurrentItem} = 0, ${varClicked}`);
    this.append(`${varCurrentItem}, ${varClicked} = ImGui.Combo(${this.formatString(widget.label)}, ${varCurrentItem}, {${items}}, ${widget.items.length})`);
    this.formatTooltip(widget);
  }

}
