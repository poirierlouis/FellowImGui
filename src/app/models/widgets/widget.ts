import {v4 as uuidv4} from "uuid";
import {BehaviorSubject, Observable} from "rxjs";
import {FIGContainer} from "./container";

export enum FIGWidgetType {
  window,
  text,
  button,
  separator
}

export abstract class FIGWidget {

  public readonly uuid: string;
  public readonly type: FIGWidgetType;
  public readonly needParent: boolean;
  public readonly icon: string;

  public parent?: FIGContainer;

  protected readonly updateSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public readonly update$: Observable<void> = this.updateSubject.asObservable();

  protected constructor(type: FIGWidgetType,
                        needParent: boolean,
                        icon: string) {
    this.uuid = uuidv4();
    this.type = type;
    this.needParent = needParent;
    this.icon = icon;
  }

  public abstract get name(): string;

  public abstract draw(): void;

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
