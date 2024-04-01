import {FIGButtonWidget, FIGDir} from "../models/widgets/button.widget";
import {FIGCheckboxWidget} from "../models/widgets/checkbox.widget";
import {FIGComboWidget} from "../models/widgets/combo.widget";
import {FIGInputTextFlags, FIGInputTextWidget} from "../models/widgets/input-text.widget";
import {FIGLabelWidget} from "../models/widgets/label.widget";
import {FIGRadioWidget} from "../models/widgets/radio.widget";
import {FIGSeparatorWidget} from "../models/widgets/separator.widget";
import {FIGTextWidget} from "../models/widgets/text.widget";
import {FIGCondFlags, FIGWindowFlags, FIGWindowWidget} from "../models/widgets/window.widget";
import {CaseStyle, FIGFormatter} from "./formatter";
import {FIGWithTooltip} from "../models/widgets/with-tooltip.widget";
import {Color, Vector2} from "../models/math";
import {capitalize, formatNumber} from "../models/string";
import {FIGProgressBarWidget} from "../models/widgets/progress-bar.widget";
import {FIGInputNumberWidget} from "../models/widgets/input-number.widget";
import {FIGInputColorEditWidget} from "../models/widgets/input-color-edit.widget";
import {FIGCollapsingHeaderWidget} from "../models/widgets/collapsing-header.widget";
import {FIGBulletWidget} from "../models/widgets/bullet.widget";
import {FIGInputTextareaWidget} from "../models/widgets/input-textarea.widget";
import {FIGListBoxWidget} from "../models/widgets/listbox.widget";
import {FIGTabBarFlags, FIGTabBarWidget} from "../models/widgets/tab-bar.widget";
import {FIGTabItemFlags, FIGTabItemWidget} from "../models/widgets/tab-item.widget";
import {FIGPlotWidget} from "../models/widgets/plot.widget";
import {FIGWidgetType} from "../models/widgets/widget";
import {FIGVerticalSliderType, FIGVerticalSliderWidget} from "../models/widgets/vertical-slider.widget";
import {FIGSameLineWidget} from "../models/widgets/same-line.widget";
import {FIGNewLineWidget} from "../models/widgets/new-line.widget";
import {FIGSpacingWidget} from "../models/widgets/spacing.widget";
import {FIGDummyWidget} from "../models/widgets/dummy.widget";
import {FIGTreeNodeFlags, FIGTreeNodeWidget} from "../models/widgets/tree-node.widget";
import {FIGSliderType, FIGSliderWidget} from "../models/widgets/slider.widget";
import {FIGChildWindowWidget} from "../models/widgets/child-window.widget";
import {FIGSelectableFlags, FIGSelectableWidget} from "../models/widgets/selectable.widget";
import {FIGGroupWidget} from "../models/widgets/group.widget";
import {FIGModalWidget} from "../models/widgets/modal.widget";
import {FIGPopupWidget} from "../models/widgets/popup.widget";
import {FIGMenuItemWidget} from "../models/widgets/menu-item.widget";
import {FIGMenuWidget} from "../models/widgets/menu.widget";
import {FIGBlocForWidget} from "../models/widgets/bloc-for.widget";

interface InputNumberFormatItem {
  readonly fn: string;
  readonly args: (args: any) => string[];
}

export class FIGLuaFormatter extends FIGFormatter {
  private readonly inputNumberFormatter: InputNumberFormatItem[] = [
    {fn: 'ImGui.InputInt', args: (args) => [args.varStep, args.varStepFast]},
    {fn: 'ImGui.InputInt2', args: () => []},
    {fn: 'ImGui.InputInt3', args: () => []},
    {fn: 'ImGui.InputInt4', args: () => []},

    {fn: 'ImGui.InputFloat', args: (args) => [args.varStep, args.varStepFast, args.varFormat]},
    {fn: 'ImGui.InputFloat2', args: (args) => [args.varFormat]},
    {fn: 'ImGui.InputFloat3', args: (args) => [args.varFormat]},
    {fn: 'ImGui.InputFloat4', args: (args) => [args.varFormat]},

    {fn: 'ImGui.InputDouble', args: (args) => [args.varStep, args.varStepFast, args.varFormat]}
  ];
  private readonly sliderFormatter: string[][] = [
    // FIGSliderType.slider
    [
      'ImGui.SliderInt', 'ImGui.SliderInt2', 'ImGui.SliderInt3', 'ImGui.SliderInt4',
      'ImGui.SliderFloat', 'ImGui.SliderFloat2', 'ImGui.SliderFloat3', 'ImGui.SliderFloat4'
    ],
    // FIGSliderType.drag
    [
      'ImGui.DragInt', 'ImGui.DragInt2', 'ImGui.DragInt3', 'ImGui.DragInt4',
      'ImGui.DragFloat', 'ImGui.DragFloat2', 'ImGui.DragFloat3', 'ImGui.DragFloat4'
    ]
  ];

  constructor() {
    super('Lua - sol2', CaseStyle.camelCase);
    this.notSupported.push(FIGWidgetType.plot);
    this.options.indent = '  ';
  }

  private static formatColor(color: Color): string {
    return `${color.r}, ${color.g}, ${color.b}, ${color.a}`;
  }

  private static formatDir(arrow: FIGDir): string {
    return `ImGuiDir.${capitalize(FIGDir[arrow])}`;
  }

  protected override formatFlags<T>(flags: number, flagsList: T[], flagsType: any, flagName: string): string {
    let varFlags: string = '';

    if (flags !== 0) {
      varFlags = ', ';
      varFlags += flagsList
        .filter((flag) => (flags & (flag as number)) === flag)
        .map((flag) => flagsType[flag])
        .map((name) => `${flagName}.${name}`)
        .join(' + ');
    }
    return varFlags;
  }

  // Layouts
  protected override formatWindow(widget: FIGWindowWidget): void {
    let varArgs: string = '';

    if (widget.flags !== 0) {
      varArgs = ', true';
      varArgs += this.formatFlags(widget.flags, FIGWindowWidget.flags, FIGWindowFlags, 'ImGuiWindowFlags');
    }
    if (widget.minSize) {
      this.append(`ImGui.PushStyleVar(ImGuiStyleVar.WindowMinSize, ${widget.minSize.width}, ${widget.minSize.height})`);
    }
    if (widget.size) {
      let varCondFlag: string = '';

      if (widget.sizeFlags !== 0) {
        varCondFlag = this.formatFlags(widget.sizeFlags, FIGWindowWidget.condFlags, FIGCondFlags, 'ImGuiCond');
      }
      this.append(`ImGui.SetNextWindowSize(${widget.size.width}, ${widget.size.height}${varCondFlag})`);
    }
    this.append(`if not ImGui.Begin(${this.formatString(widget.label)}${varArgs}) then`);
    this.appendIndent('ImGui.End()');
    this.appendIndent('return');
    this.append('end');
    this.append('');
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.End()');
  }

  protected override formatChildWindow(widget: FIGChildWindowWidget): void {
    const isPercentage = (value: number) => value > 0.0 && value <= 1.0;
    const varWidth: string = this.formatVar(`${widget.label} width`, widget.type);
    const varHeight: string = this.formatVar(`${widget.label} height`, widget.type);
    const varArgs: string[] = [this.formatString(widget.label)];
    let width: string = widget.size.width.toString();
    let height: string = widget.size.height.toString();

    if (isPercentage(widget.size.width) || isPercentage(widget.size.height)) {
      this.append(`local ${varWidth}, ${varHeight} = ImGui.GetContentRegionAvail()`);
      if (isPercentage(widget.size.width)) {
        width += ` * ${varWidth}`;
      }
      if (isPercentage(widget.size.height)) {
        height += ` * ${varHeight}`;
      }
    }
    varArgs.push(width);
    varArgs.push(height);
    varArgs.push(widget.frameBorder.toString());
    if (widget.flags !== 0) {
      varArgs.push(this.formatFlags(widget.flags, FIGWindowWidget.flags, FIGWindowFlags, 'ImGuiWindowFlags'));
    }
    this.append(`if ImGui.BeginChild(${varArgs.join(', ')}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.EndChild()');
    this.popIndent();
    this.append('end');
  }

  protected override formatModal(widget: FIGModalWidget): void {
    const varLabel: string = this.formatString(widget.label);

    this.append('--[[');
    this.append(`if ImGui.Button(${this.formatString(`Open ${widget.label}`)}) then`);
    this.appendIndent(`ImGui.OpenPopup(${varLabel})`);
    this.append('end');
    this.append('--]]');
    const varFlags: string = this.formatFlags(widget.flags, FIGWindowWidget.flags, FIGWindowFlags, 'ImGuiWindowFlags');

    this.append(`if ImGui.BeginPopupModal(${varLabel}, true${varFlags}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.EndPopup()');
    this.popIndent();
    this.append('end');
  }

  protected override formatCollapsingHeader(widget: FIGCollapsingHeaderWidget): void {
    const varFlags: string = this.formatFlags<FIGTreeNodeFlags>(
      widget.flags, FIGTreeNodeWidget.flags, FIGTreeNodeFlags, 'ImGuiTreeNodeFlags'
    );

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

  protected override formatTabBar(widget: FIGTabBarWidget): void {
    const varFlags: string = this.formatFlags<FIGTabBarFlags>(
      widget.flags, FIGTabBarWidget.flags, FIGTabBarFlags, 'ImGuiTabBarFlags'
    );

    this.append(`if ImGui.BeginTabBar(${this.formatString(widget.label)}${varFlags}) then`);
    this.pushIndent();
    for (const tabItem of widget.children) {
      this.formatTabItem(tabItem as FIGTabItemWidget);
      this.append('');
    }
    this.append('ImGui.EndTabBar()');
    this.popIndent();
    this.append('end');
  }

  protected override formatTabItem(widget: FIGTabItemWidget): void {
    const varFlags: string = this.formatFlags<FIGTabItemFlags>(
      widget.flags, FIGTabItemWidget.flags, FIGTabItemFlags, 'ImGuiTabItemFlags'
    );

    if (varFlags.length === 0) {
      this.append(`if ImGui.BeginTabItem(${this.formatString(widget.label)}) then`);
    } else {
      const varOpen: string = this.formatVar(`${widget.label} is open`, widget.type);
      const varSelected: string = this.formatVar(`${widget.label} is selected`, widget.type);

      this.append(`local ${varOpen} = true, ${varSelected}`);
      this.append(`${varOpen}, ${varSelected} = ImGui.BeginTabItem(${this.formatString(widget.label)}, ${varOpen}${varFlags})`);
      this.append(`if ${varSelected} then`);
    }
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.EndTabItem()');
    this.popIndent();
    this.append('end');
  }

  protected override formatGroup(widget: FIGGroupWidget): void {
    this.append('ImGui.BeginGroup()');
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.EndGroup()');
  }

  protected override formatSameLine(widget: FIGSameLineWidget): void {
    const varArgs: string[] = [];

    if (widget.offsetFromStart !== undefined || widget.spacing !== undefined) {
      varArgs.push((widget.offsetFromStart ?? 0).toString());
    }
    if (widget.spacing !== undefined) {
      varArgs.push(widget.spacing.toString());
    }
    this.append(`ImGui.SameLine(${varArgs.join(', ')})`);
  }

  protected override formatNewLine(_widget: FIGNewLineWidget): void {
    this.append('ImGui.NewLine()');
  }

  protected override formatSpacing(_widget: FIGSpacingWidget): void {
    this.append('ImGui.Spacing()');
  }

  protected override formatDummy(widget: FIGDummyWidget): void {
    this.append(`ImGui.Dummy(${widget.width}, ${widget.height})`);
    this.formatTooltip(widget);
  }

  protected override formatSeparator(_widget: FIGSeparatorWidget): void {
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
    if (widget.align) {
      this.append('ImGui.AlignTextToFramePadding()');
    }
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

  protected override formatPlot(_widget: FIGPlotWidget): void {
  }

  protected override formatTreeNode(widget: FIGTreeNodeWidget): void {
    const varFlags: string = this.formatFlags<FIGTreeNodeFlags>(
      widget.flags, FIGTreeNodeWidget.flags, FIGTreeNodeFlags, 'ImGuiTreeNodeFlags'
    );
    const fn: string = widget.flags === 0 ? 'ImGui.TreeNode' : 'ImGui.TreeNodeEx';

    this.append(`if ${fn}(${this.formatString(widget.label)}${varFlags}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.TreePop()');
    this.popIndent();
    this.append('end');
  }

  protected override formatSelectable(widget: FIGSelectableWidget): void {
    const varSelected: string = this.formatVar(`${widget.text} selected`, widget.type);
    const varArgs: string[] = [this.formatString(widget.text), varSelected];
    let varFlags: string = this.formatFlags<FIGSelectableFlags>(
      widget.flags, FIGSelectableWidget.flags, FIGSelectableFlags, 'ImGuiSelectableFlags'
    );

    varFlags = (widget.flags === 0) ? '0' : varFlags.slice(2);
    if (widget.flags !== 0 || widget.size.width !== 0 || widget.size.height !== 0) {
      varArgs.push(varFlags);
      if (widget.size.width !== 0 || widget.size.height !== 0) {
        varArgs.push(widget.size.width.toString());
      }
      if (widget.size.height !== 0) {
        varArgs.push(widget.size.height.toString());
      }
    }
    this.append(`local ${varSelected} = ${widget.selected}`);
    this.append(`${varSelected} = ImGui.Selectable(${varArgs.join(', ')})`);
    this.formatTooltip(widget);
  }

  protected override formatPopup(widget: FIGPopupWidget): void {
    const varLabel: string = this.formatString(widget.label);
    const fn: string = (widget.contextItem) ? 'BeginPopupContextItem' : 'BeginPopup';

    if (widget.contextItem) {
      this.append(`-- ImGui.Button(${this.formatString(widget.debugLabel)})`);
    } else {
      this.append('--[[');
      this.append(`if ImGui.Button(${this.formatString(widget.debugLabel)}) then`);
      this.appendIndent(`ImGui.OpenPopup(${varLabel})`);
      this.append('end');
      this.append('--]]');
    }
    this.append(`if ImGui.${fn}(${varLabel}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('--[[');
    this.append('if ImGui.Button("Close") then');
    this.appendIndent('ImGui.CloseCurrentPopup()');
    this.append('end');
    this.append('--]]');
    this.append('ImGui.EndPopup()');
    this.popIndent();
    this.append('end');
  }

  protected override formatMenu(widget: FIGMenuWidget): void {
    const varDisabled: string = !widget.enabled ? ', false' : '';

    this.append(`if ImGui.BeginMenu(${this.formatString(widget.label)}${varDisabled}) then`);
    this.pushIndent();
    for (const child of widget.children) {
      this.formatWidget(child);
    }
    this.append('ImGui.EndMenu()');
    this.popIndent();
    this.append('end');
  }

  protected override formatMenuItem(widget: FIGMenuItemWidget): void {
    const varActivated: string = this.formatVar(`${widget.label} activated`, widget.type);
    const varSelected: string = this.formatVar(`${widget.label} selected`, widget.type);
    const args: string[] = [this.formatString(widget.label)];
    let varDef: string = '';

    if (widget.shortcut || widget.isSelectable || !widget.enabled) {
      args.push(this.formatString(widget.shortcut ?? ''));
    }
    if (widget.isSelectable || !widget.enabled) {
      this.append(`local ${varSelected} = false`);
      args.push(varSelected);
    }
    if (!widget.enabled) {
      args.push('false');
    }
    if (args.length <= 2) {
      varDef = `local ${varActivated} = `;
    } else {
      this.append(`local ${varActivated}`);
      varDef = `${varSelected}, ${varActivated} = `;
    }
    this.append(`${varDef}ImGui.MenuItem(${args.join(', ')})`);
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
    const varFlags: string = this.formatFlags<FIGInputTextFlags>(
      widget.flags, FIGInputTextWidget.flags, FIGInputTextFlags, 'ImGuiInputTextFlags'
    );

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
    const varFlags: string = this.formatFlags<FIGInputTextFlags>(
      widget.flags, FIGInputTextWidget.flags, FIGInputTextFlags, 'ImGuiInputTextFlags'
    );

    this.append(`local ${varText} = ${this.formatString(widget.value)}, ${varSelected}`);
    this.append(`${varDef} = ImGui.InputTextMultiline(${this.formatString(widget.label)}, ${varText}, ${widget.bufferSize}, ${varSize}${varFlags})`);
    this.formatTooltip(widget);
  }

  protected override formatInputNumber(widget: FIGInputNumberWidget): void {
    const size: number = FIGInputNumberWidget.getArraySize(widget.dataType);
    const varValue: string = this.formatVar(`${widget.label} value${size > 0 ? 's' : ''}`, widget.type);
    const varUsed: string = this.formatVar(`${widget.label} used`, widget.type);
    const args: string[] = [this.formatString(widget.label), varValue];
    const argsData: any = {
      varStep: widget.step.toString(),
      varStepFast: widget.stepFast.toString(),
      varFormat: this.formatString(widget.format)
    };
    const format: InputNumberFormatItem = this.inputNumberFormatter[widget.dataType];
    const fn: string = format.fn;

    args.push(...format.args(argsData));
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

  protected override formatSlider(widget: FIGSliderWidget): void {
    const size: number = FIGSliderWidget.getArraySize(widget.dataType);
    const varValue: string = this.formatVar(`${widget.label} value${size > 0 ? 's' : ''}`, widget.type);
    const varUsed: string = this.formatVar(`${widget.label} used`, widget.type);
    const precision: number | undefined = FIGSliderWidget.getPrecision(widget);
    const isInteger: boolean = FIGSliderWidget.isInteger(widget.dataType);
    const args: string[] = [this.formatString(widget.label), varValue];
    const fn: string = this.sliderFormatter[widget.sliderType][widget.dataType];
    let value: string;

    if (size === 0) {
      const number: number = widget.value as number;

      value = isInteger ? number.toString() : number.toFixed(precision);
    } else {
      const numbers: number[] = widget.value as number[];

      value = numbers.map((item) => isInteger ? item.toString() : item.toFixed(precision)).join(', ');
      value = `{${value}}`;
    }
    if (widget.sliderType === FIGSliderType.drag) {
      args.push(widget.valueSpeed.toString());
    }
    args.push(widget.valueMin.toString());
    args.push(widget.valueMax.toString());
    args.push(this.formatString(widget.format));
    if (!FIGSliderWidget.isInteger(widget.dataType) && widget.power !== 0) {
      args.push(widget.power.toString());
    }
    this.append(`local ${varValue} = ${value}, ${varUsed}`);
    this.append(`${varValue}, ${varUsed} = ${fn}(${args.join(', ')})`);
    this.formatTooltip(widget);
  }

  protected override formatVerticalSlider(widget: FIGVerticalSliderWidget): void {
    const varValue: string = this.formatVar(`${widget.label.slice(2)} value`, widget.type);
    const varUsed: string = this.formatVar(`${widget.label.slice(2)} used`, widget.type);
    const varArgs: string[] = [];
    let fn: string = '';

    varArgs.push(this.formatString(widget.label));
    varArgs.push(widget.size.width.toString());
    varArgs.push(widget.size.height.toString());
    varArgs.push(varValue);
    varArgs.push(widget.valueMin.toString());
    varArgs.push(widget.valueMax.toString());
    varArgs.push(widget.tooltip ? '""' : this.formatString(widget.format));
    if (widget.dataType === FIGVerticalSliderType.int) {
      fn = 'ImGui.VSliderInt';
    } else if (widget.dataType === FIGVerticalSliderType.float) {
      fn = 'ImGui.VSliderFloat';
      varArgs.push(widget.power.toString());
    }
    this.append(`local ${varValue} = ${formatNumber(widget.value, widget.format)}, ${varUsed}`);
    this.append(`${varValue}, ${varUsed} = ${fn}(${varArgs.join(', ')})`);
    if (widget.tooltip) {
      this.append('if ImGui.IsItemActive() or ImGui.IsItemHovered() then');
      this.appendIndent(`ImGui.SetTooltip(string.format(${this.formatString(widget.format)}, ${varValue}))`);
      this.append('end');
    }
  }

  protected override formatListBox(widget: FIGListBoxWidget): void {
    const varCurrentItem: string = this.formatVar(`${widget.label} current item`, widget.type);
    const varClicked: string = this.formatVar(`${widget.label} clicked`, widget.type);
    const items: string = widget.items.map((item) => this.formatString(item)).join(', ');

    this.append(`local ${varCurrentItem} = ${widget.selectedItem}, ${varClicked}`);
    this.append(`${varCurrentItem}, ${varClicked} = ImGui.ListBox(${this.formatString(widget.label)}, ${varCurrentItem}, {${items}}, ${widget.items.length})`);
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

  // Blocs
  protected override formatBlocFor(widget: FIGBlocForWidget): void {
    this.append(`for i=1,${widget.size} do`);
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

}
