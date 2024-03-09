import {v4 as uuidv4} from "uuid";
import {BehaviorSubject, Observable} from "rxjs";

export enum FIGWidgetType {
  window,
  text,
  button
}

export abstract class FIGWidget {

  public readonly uuid: string;

  protected readonly updateSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public readonly update$: Observable<void> = this.updateSubject.asObservable();

  protected constructor(public readonly type: FIGWidgetType,
                        public readonly icon: string) {
    this.uuid = uuidv4();
  }

  public abstract get name(): string;

  public abstract draw(): void;

  public trackBy(): any {
    return this.uuid;
  }
}
