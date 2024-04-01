import {v4 as uuidv4} from "uuid";
import {BehaviorSubject, Observable} from "rxjs";
import {FIGContainer} from "./container";
import {Vector2} from "../math";
import {FIGEvent, FIGEventType} from "../events/event";

export enum FIGWidgetType {
  // Layouts
  window,
  childWindow,
  modal,
  collapsingHeader,
  tabBar,
  tabItem,
  group,
  sameLine,
  newLine,
  spacing,
  dummy,
  separator,

  // Basics
  bullet,
  text,
  button,
  progressBar,
  plot,
  treeNode,
  selectable,
  popup,
  menu,
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
  blocFor
}

export abstract class FIGWidget {

  public readonly uuid: string;
  public readonly type: FIGWidgetType;
  public readonly needParent: boolean;

  public parent?: FIGContainer;

  public isFocused: boolean = false;

  protected readonly updateSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public readonly update$: Observable<void> = this.updateSubject.asObservable();

  private readonly eventSubject: BehaviorSubject<FIGEvent | undefined> = new BehaviorSubject<FIGEvent | undefined>(undefined);
  public readonly event$: Observable<FIGEvent | undefined> = this.eventSubject.asObservable();

  protected readonly _focusOffset: Vector2 = {x: 4, y: 4};
  private readonly _focusMin: Vector2 = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
  private readonly _focusMax: Vector2 = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};

  protected constructor(type: FIGWidgetType,
                        needParent: boolean) {
    this.uuid = uuidv4();
    this.type = type;
    this.needParent = needParent;
  }

  public static isContainer(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.window ||
      type === FIGWidgetType.childWindow ||
      type === FIGWidgetType.modal ||
      type === FIGWidgetType.collapsingHeader ||
      type === FIGWidgetType.tabBar ||
      type === FIGWidgetType.tabItem ||
      type === FIGWidgetType.group ||
      type === FIGWidgetType.treeNode ||
      type === FIGWidgetType.popup ||
      type === FIGWidgetType.menu ||
      type === FIGWidgetType.blocFor;
  }

  public abstract get name(): string;

  public abstract draw(): void;

  /**
   * Callback after widget is created and inserted in tree.
   */
  public onCreated(): void {

  }

  /**
   * Callback after widget is moved within tree.
   */
  public onMoved(): void {

  }

  /**
   * Callback after widget is removed from tree.
   */
  public onDeleted(): void {

  }

  public listen(): void {
    if (ImGui.IsItemClicked()) {
      this.eventSubject.next({type: FIGEventType.click, target: this});
    }
  }

  public trackBy(): any {
    return this.uuid;
  }

  public link(parent?: FIGContainer): void {
    this.parent = parent;
  }

  public flatMap(): FIGWidget[] {
    return [this];
  }

  protected triggerUpdate(): void {
    this.updateSubject.next();
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

}
