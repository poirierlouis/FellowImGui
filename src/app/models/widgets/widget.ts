import {v4 as uuidv4} from "uuid";
import {BehaviorSubject, Observable} from "rxjs";
import {FIGContainer} from "./container";
import {Vector2} from "../math";

export enum FIGWidgetType {
  window,
  text,
  button,
  checkbox,
  radio,
  label,
  combo,
  separator
}

export abstract class FIGWidget {

  public readonly uuid: string;
  public readonly type: FIGWidgetType;
  public readonly needParent: boolean;
  public readonly icon: string;

  public parent?: FIGContainer;

  public isFocused: boolean = false;

  protected readonly updateSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public readonly update$: Observable<void> = this.updateSubject.asObservable();

  protected readonly _focusOffset: Vector2 = {x: 4, y: 4};

  protected constructor(type: FIGWidgetType,
                        needParent: boolean,
                        icon: string) {
    this.uuid = uuidv4();
    this.type = type;
    this.needParent = needParent;
    this.icon = icon;
  }

  public abstract get name(): string;

  public draw(): void {
    if (this.isFocused) {
      const drawList = ImGui.GetWindowDrawList();
      const min: Vector2 = ImGui.GetItemRectMin();
      const max: Vector2 = ImGui.GetItemRectMax();

      min.x -= this._focusOffset.x;
      min.y -= this._focusOffset.y;
      max.x += this._focusOffset.x;
      max.y += this._focusOffset.y;
      drawList.AddRect(min, max, ImGui.COL32(255, 255, 0, 255));
    }
  }

  public dispose(): void {

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
}
