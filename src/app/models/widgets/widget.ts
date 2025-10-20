import {BehaviorSubject, type Observable} from "rxjs";
import {v4 as uuidv4} from "uuid";
import {type FIGEvent, FIGEventType} from "../events/event";
import {ArrayField} from "../fields/array.field";
import {BoolField} from "../fields/bool.field";
import {ColorField} from "../fields/color.field";
import {EnumField, type EnumFieldType, type EnumOption} from "../fields/enum.field";
import type {Field} from "../fields/field";
import {type FlagOption, FlagsField} from "../fields/flags.field";
import {FloatField} from "../fields/float.field";
import {IntegerField} from "../fields/integer.field";
import {NumberField} from "../fields/number.field";
import {Number4Field} from "../fields/number4.field";
import {SizeField} from "../fields/size.field";
import {StringField} from "../fields/string.field";
import type {Color, Size, Vector2} from "../math";
import type {FIGBlocForWidget} from "./bloc-for.widget";
import type {FIGBulletWidget} from "./bullet.widget";
import type {FIGButtonWidget} from "./button.widget";
import type {FIGCheckboxWidget} from "./checkbox.widget";
import type {FIGChildWindowWidget} from "./child-window.widget";
import type {FIGCollapsingHeaderWidget} from "./collapsing-header.widget";
import type {FIGComboWidget} from "./combo.widget";
import type {FIGContainer} from "./container";
import type {FIGDummyWidget} from "./dummy.widget";
import type {FIGGroupWidget} from "./group.widget";
import type {FIGInputColorEditWidget} from "./input-color-edit.widget";
import type {FIGInputNumberWidget} from "./input-number.widget";
import type {FIGInputTextWidget} from "./input-text.widget";
import type {FIGInputTextareaWidget} from "./input-textarea.widget";
import type {FIGLabelWidget} from "./label.widget";
import type {FIGListBoxWidget} from "./listbox.widget";
import type {FIGMenuWidget} from "./menu.widget";
import type {FIGMenuBarWidget} from "./menu-bar.widget";
import type {FIGMenuItemWidget} from "./menu-item.widget";
import type {FIGModalWidget} from "./modal.widget";
import type {FIGNewLineWidget} from "./new-line.widget";
import type {FIGPlotWidget} from "./plot.widget";
import type {FIGPopupWidget} from "./popup.widget";
import type {FIGProgressBarWidget} from "./progress-bar.widget";
import type {FIGRadioWidget} from "./radio.widget";
import type {FIGSameLineWidget} from "./same-line.widget";
import type {FIGSelectableWidget} from "./selectable.widget";
import type {FIGSeparatorWidget} from "./separator.widget";
import type {FIGSliderWidget} from "./slider.widget";
import type {FIGSpacingWidget} from "./spacing.widget";
import type {FIGTabBarWidget} from "./tab-bar.widget";
import type {FIGTabItemWidget} from "./tab-item.widget";
import type {FIGTableWidget} from "./table.widget";
import type {FIGTableColumnWidget} from "./table-column.widget";
import type {FIGTableRowWidget} from "./table-row.widget";
import type {FIGTextWidget} from "./text.widget";
import type {FIGTreeNodeWidget} from "./tree-node.widget";
import type {FIGVerticalSliderWidget} from "./vertical-slider.widget";
import type {FIGWindowWidget} from "./window.widget";

export enum FIGWidgetType {
  // NOTE: order types per category. Manually increment type's value for
  // serializing purpose.

  // Layouts
  window,
  childWindow,
  modal,
  collapsingHeader,
  tabBar,
  tabItem,
  table = 34,
  tableRow = 35,
  tableColumn = 36,
  group = 6,
  sameLine,
  newLine,
  spacing,
  dummy,

  // Basics
  separator,
  bullet,
  text,
  button,
  progressBar,
  plot,
  treeNode,
  selectable,
  popup,
  menuBar = 37,
  menu = 20,
  menuItem,

  // Forms / Inputs
  label,
  inputText,
  inputTextarea,
  inputNumber,
  inputColorEdit,
  slider,
  verticalSlider,
  listbox,
  checkbox,
  radio,
  combo,

  // Blocs
  blocFor,
}

export type FIGWidgetTypeMap = {
  // Layouts
  [FIGWidgetType.window]: FIGWindowWidget;
  [FIGWidgetType.childWindow]: FIGChildWindowWidget;
  [FIGWidgetType.modal]: FIGModalWidget;
  [FIGWidgetType.collapsingHeader]: FIGCollapsingHeaderWidget;
  [FIGWidgetType.tabBar]: FIGTabBarWidget;
  [FIGWidgetType.tabItem]: FIGTabItemWidget;
  [FIGWidgetType.table]: FIGTableWidget;
  [FIGWidgetType.tableRow]: FIGTableRowWidget;
  [FIGWidgetType.tableColumn]: FIGTableColumnWidget;
  [FIGWidgetType.group]: FIGGroupWidget;
  [FIGWidgetType.sameLine]: FIGSameLineWidget;
  [FIGWidgetType.newLine]: FIGNewLineWidget;
  [FIGWidgetType.spacing]: FIGSpacingWidget;
  [FIGWidgetType.dummy]: FIGDummyWidget;

  // Basics
  [FIGWidgetType.separator]: FIGSeparatorWidget;
  [FIGWidgetType.bullet]: FIGBulletWidget;
  [FIGWidgetType.text]: FIGTextWidget;
  [FIGWidgetType.button]: FIGButtonWidget;
  [FIGWidgetType.progressBar]: FIGProgressBarWidget;
  [FIGWidgetType.plot]: FIGPlotWidget;
  [FIGWidgetType.treeNode]: FIGTreeNodeWidget;
  [FIGWidgetType.selectable]: FIGSelectableWidget;
  [FIGWidgetType.popup]: FIGPopupWidget;
  [FIGWidgetType.menuBar]: FIGMenuBarWidget;
  [FIGWidgetType.menu]: FIGMenuWidget;
  [FIGWidgetType.menuItem]: FIGMenuItemWidget;

  // Forms / Inputs
  [FIGWidgetType.label]: FIGLabelWidget;
  [FIGWidgetType.inputText]: FIGInputTextWidget;
  [FIGWidgetType.inputTextarea]: FIGInputTextareaWidget;
  [FIGWidgetType.inputNumber]: FIGInputNumberWidget;
  [FIGWidgetType.inputColorEdit]: FIGInputColorEditWidget;
  [FIGWidgetType.slider]: FIGSliderWidget;
  [FIGWidgetType.verticalSlider]: FIGVerticalSliderWidget;
  [FIGWidgetType.listbox]: FIGListBoxWidget;
  [FIGWidgetType.checkbox]: FIGCheckboxWidget;
  [FIGWidgetType.radio]: FIGRadioWidget;
  [FIGWidgetType.combo]: FIGComboWidget;

  // Blocs
  [FIGWidgetType.blocFor]: FIGBlocForWidget;
};

type Fields = Record<string, Field>;

export abstract class FIGWidget {
  public static readonly excludeKeys: string[] = [
    "uuid",
    "type",
    "needParent",
    "parent",
    "isFocused",
    "children",
    "updateSubject",
    "update$",
    "eventSubject",
    "_focusOffset",
    "_focusMin",
    "_focusMax",
    "_isSelected",
  ];

  public readonly uuid: string;
  public readonly type: FIGWidgetType;
  public readonly needParent: boolean;

  public parent?: FIGContainer;

  public isFocused: boolean = false;

  protected readonly updateSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public readonly update$: Observable<void> = this.updateSubject.asObservable();

  protected readonly _focusOffset: Vector2 = {x: 4, y: 4};
  private eventSubject?: BehaviorSubject<FIGEvent | undefined>;

  private readonly _focusMin: Vector2 = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
  private readonly _focusMax: Vector2 = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};

  private readonly fields: Fields;
  private readonly properties: string[];

  private _isSelected: boolean = false;

  protected constructor(type: FIGWidgetType, needParent: boolean) {
    this.uuid = uuidv4();
    this.type = type;
    this.needParent = needParent;
    this.fields = {};
    this.properties = [];
  }

  public abstract get name(): string;

  public static isContainer(type: FIGWidgetType): boolean {
    return (
      type === FIGWidgetType.window ||
      type === FIGWidgetType.childWindow ||
      type === FIGWidgetType.modal ||
      type === FIGWidgetType.collapsingHeader ||
      type === FIGWidgetType.tabBar ||
      type === FIGWidgetType.tabItem ||
      type === FIGWidgetType.table ||
      type === FIGWidgetType.tableRow ||
      type === FIGWidgetType.tableColumn ||
      type === FIGWidgetType.group ||
      type === FIGWidgetType.treeNode ||
      type === FIGWidgetType.popup ||
      type === FIGWidgetType.menuBar ||
      type === FIGWidgetType.menu ||
      type === FIGWidgetType.blocFor
    );
  }

  public abstract draw(): void;

  /**
   * Callback after widget is created and inserted in tree.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onCreated(): void {}

  /**
   * Callback after widget is moved within tree.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onMoved(): void {}

  /**
   * Callback after widget is removed from tree.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onDeleted(): void {}

  public getField(name: string): Field {
    return this.fields[name];
  }

  public listen(): void {
    if (!this.eventSubject) {
      return;
    }
    if (ImGui.IsItemClicked()) {
      this.eventSubject.next({type: FIGEventType.click, target: this});
    }
  }

  public trackBy(): string | string[] {
    return this.uuid;
  }

  public link(eventSubject: BehaviorSubject<FIGEvent | undefined>, parent?: FIGContainer): void {
    this.eventSubject = eventSubject;
    this.parent = parent;
  }

  public flatMap(): FIGWidget[] {
    return [this];
  }

  public select(): void {
    this._isSelected = true;
  }

  public getFields(): Field[] {
    return this.properties.map((name) => this.fields[name]);
  }

  protected drawFocus(): void {
    if (this.isFocused) {
      this.growFocusRect();
      const drawList = ImGui.GetWindowDrawList();

      this._focusMin.x -= this._focusOffset.x;
      this._focusMin.y -= this._focusOffset.y;
      this._focusMax.x += this._focusOffset.x;
      this._focusMax.y += this._focusOffset.y;
      drawList.AddRect(this._focusMin, this._focusMax, ImGui.COL32(255, 255, 0, 255));
      this._focusMin.x = Number.MAX_VALUE;
      this._focusMin.y = Number.MAX_VALUE;
      this._focusMax.x = Number.MIN_VALUE;
      this._focusMax.y = Number.MIN_VALUE;
    }
  }

  protected scrollTo(): void {
    if (!this._isSelected) {
      return;
    }
    ImGui.SetScrollHereY();
    this._isSelected = false;
  }

  protected growFocusRect(): void {
    if (!this.isFocused) {
      return;
    }
    const min: Vector2 = ImGui.GetItemRectMin();
    const max: Vector2 = ImGui.GetItemRectMax();

    this._focusMin.x = Math.min(this._focusMin.x, min.x);
    this._focusMin.y = Math.min(this._focusMin.y, min.y);
    this._focusMax.x = Math.max(this._focusMax.x, max.x);
    this._focusMax.y = Math.max(this._focusMax.y, max.y);
  }

  protected registerBool(
    name: string,
    label: string,
    value?: boolean,
    isOptional: boolean = false,
    defaultValue?: boolean,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new BoolField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerInteger(
    name: string,
    label: string,
    value?: number,
    isOptional: boolean = false,
    defaultValue?: number,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new IntegerField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerFloat(
    name: string,
    label: string,
    value?: number,
    isOptional: boolean = false,
    defaultValue?: number,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new FloatField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerNumber(
    name: string,
    label: string,
    value?: number,
    isOptional: boolean = false,
    defaultValue?: number,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new NumberField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerString(
    name: string,
    label: string,
    value?: string,
    isOptional: boolean = false,
    defaultValue?: string,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new StringField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerArray(
    name: string,
    label: string,
    value?: unknown[],
    isOptional: boolean = false,
    defaultValue?: unknown[],
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new ArrayField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerSize(
    name: string,
    label: string,
    isRelative: boolean = false,
    value?: Size,
    isOptional: boolean = false,
    defaultValue?: Size,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new SizeField(name, label, isRelative, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerFlags(
    name: string,
    label: string,
    options: FlagOption[],
    value?: number,
    isOptional: boolean = false,
    defaultValue: number = 0,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new FlagsField(name, label, options, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerColor(
    name: string,
    label: string,
    value?: Color,
    isOptional: boolean = false,
    defaultValue?: Color,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new ColorField(name, label, value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerEnum<E>(
    name: string,
    label: string,
    options: E | EnumOption[],
    value?: EnumFieldType,
    isOptional: boolean = false,
    defaultValue?: EnumFieldType,
  ): void {
    if (isOptional) {
      value ??= defaultValue;
    }
    this.fields[name] = new EnumField(name, label, options as EnumOption[], value, isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  protected registerNumber4(
    name: string,
    label: string,
    value?: number[],
    isOptional: boolean = false,
    defaultValue?: number[],
  ): void {
    if (isOptional) {
      value ??= defaultValue ?? [0, 0, 0, 0];
    }
    this.fields[name] = new Number4Field(name, label, value as number[], isOptional, defaultValue) as Field;
    this.registerField(name);
  }

  private registerField(name: string): void {
    this.properties.push(name);
    Object.defineProperty(this, name, {
      get: () => this.fields[name].value,
      set: (value: never) => {
        const field: Field = this.fields[name];
        if (field.isEqual(value)) {
          return;
        }

        field.value = value;
        field.emit();
      },
    });
  }
}
