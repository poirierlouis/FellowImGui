import {FIGButtonWidget, FIGDir} from "../models/widgets/button.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGWindowWidget} from "../models/widgets/window.widget";
import {CaseStyle, FIGFormatter} from "./formatter";
import {FIGWithTooltip} from "../models/widgets/with-tooltip.widget";
import {Color} from "../models/math";
import {capitalize} from "../models/string";

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
    this.append(`if not ImGui.Begin(${this.formatString(widget.title)}) then`);
    this.appendIndent('ImGui.End()');
    this.appendIndent('return');
    this.append('end');
    this.append('');
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.End()');
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
  }

  protected override formatButton(widget: FIGButtonWidget): void {
    const varClicked: string = this.formatVar(`${widget.text} clicked`, widget.type);
    const varDef: string = `local ${varClicked} = `;

    if (widget.isSmall) {
      this.append(`${varDef}ImGui.SmallButton(${this.formatString(widget.text)})`);
    } else if (widget.arrow !== FIGDir.none) {
      this.append(`${varDef}ImGui.ArrowButton(${this.formatString(widget.text)}, ${FIGLuaFormatter.formatDir(widget.arrow)})`);
    } else {
      let size: string = '';

      if (widget.isFill) {
        size = ', -1, 0';
      }
      this.append(`${varDef}ImGui.Button(${this.formatString(widget.text)}${size})`);
    }
  }

  // Forms / Inputs
  protected override formatLabel(widget: FIGLabelWidget): void {
    this.append(`ImGui.LabelText("${widget.label}", "${widget.value}")`);
  }

  protected override formatInputText(widget: FIGInputTextWidget): void {
    const varText: string = this.formatVar(`${widget.text} text`, widget.type);
    const varSelected: string = this.formatVar(`${widget.text} selected`, widget.type);
    const varDef: string = `${varText}, ${varSelected}`;

    this.append(`local ${varText} = "", ${varSelected}`);
    if (!widget.hint) {
      this.append(`${varDef} = ImGui.InputText(${this.formatString(widget.text)}, ${varText}, ${widget.bufferSize})`);
    } else {
      this.append(`${varDef} = ImGui.InputTextWithHint(${this.formatString(widget.text)}, ${this.formatString(widget.hint)}, ${varText}, ${widget.bufferSize})`);
    }
  }

  protected override formatCheckbox(widget: FIGCheckboxWidget): void {
    const varValue: string = this.formatVar(`${widget.text} value`, widget.type);
    const varPressed: string = this.formatVar(`${widget.text} pressed`, widget.type);

    this.append(`local ${varValue} = false, ${varPressed}`);
    this.append(`${varValue}, ${varPressed} = ImGui.Checkbox(${this.formatString(widget.text)}, ${varValue})`);
  }

  protected override formatRadio(widget: FIGRadioWidget): void {
    const group: FIGRadioWidget[] = widget.parent!.filter<FIGRadioWidget>((item) => FIGRadioWidget.filterByGroupId(item, widget.groupId));
    const varValue: string = this.formatVar(`${widget.groupId} value`, widget.type);

    if (group[0].uuid === widget.uuid) {
      this.append(`local ${varValue} = ${widget.index}`);
    }
    const varPressed: string = this.formatVar(`${widget.text} pressed`, widget.type);
    const varDef: string = `${varValue}, ${varPressed} = `;

    this.append(`${varDef}ImGui.RadioButton(${this.formatString(widget.text)}, ${varValue}, ${widget.index})`);
  }

  protected override formatCombo(widget: FIGComboWidget): void {
    const varCurrentItem: string = this.formatVar(`${widget.label} current item`, widget.type);
    const varClicked: string = this.formatVar(`${widget.label} clicked`, widget.type);
    const items: string = widget.items.map((item) => this.formatString(item)).join(', ');

    this.append(`local ${varCurrentItem} = 0, ${varClicked}`);
    this.append(`${varCurrentItem}, ${varClicked} = ImGui.Combo(${this.formatString(widget.label)}, ${varCurrentItem}, {${items}}, ${widget.items.length})`);
  }

}
