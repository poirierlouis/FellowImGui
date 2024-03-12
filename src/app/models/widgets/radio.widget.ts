import {FIGWidget, FIGWidgetType} from "./widget";
import {BehaviorSubject} from "rxjs";

export class FIGRadioAccessor {
  readonly groupId: string;
  readonly subjects: BehaviorSubject<void>[];

  value: number = 0;

  access = (_ = this.value) => this.value = _;

  constructor(groupId: string) {
    this.groupId = groupId;
    this.subjects = [];
  }

  update(): void {
    this.subjects.forEach((subject) => subject.next());
  }

  registerSubject(subject: BehaviorSubject<void>): void {
    const index: number = this.subjects.findIndex((item) => item === subject);

    if (index !== -1) {
      return;
    }
    this.subjects.push(subject);
  }

  forgetSubject(subject: BehaviorSubject<void>): boolean {
    const index: number = this.subjects.findIndex((item) => item === subject);

    if (index === -1) {
      return false;
    }
    this.subjects.splice(index, 1);
    console.log('forget-subject:', this.groupId);
    return this.subjects.length === 0;
  }
}

export class FIGRadioWidget extends FIGWidget {
  private static readonly _accessors: FIGRadioAccessor[] = [];

  groupId: string;
  text: string;
  index: number = 0;

  private _access?: FIGRadioAccessor;

  constructor(groupId: string = 'Radio', text: string = 'Radio', index: number = 0) {
    super(FIGWidgetType.radio, true, 'radio');
    this.groupId = groupId;
    this.text = text;
    this.index = index;
  }

  public get name(): string {
    return this.text;
  }

  public get value(): number {
    return this._access ? this._access!.access() : -1;
  }

  private static registerAccessor(access: FIGRadioAccessor): void {
    FIGRadioWidget._accessors.push(access);
  }

  private static forgetAccessor(access: FIGRadioAccessor): void {
    const index: number = FIGRadioWidget._accessors.findIndex((item) => item.groupId === access.groupId);

    if (index === -1) {
      return;
    }
    FIGRadioWidget._accessors.splice(index, 1);
  }

  public override draw(): void {
    const accessor: FIGRadioAccessor = this._requestAccessor();
    const prevValue: number = this.value;

    ImGui.RadioButton(this.text, this._access!.access, this.index);
    super.draw();
    if (prevValue !== this.value) {
      accessor.update();
    }
  }

  public override dispose() {
    if (this._access) {
      if (this._access.forgetSubject(this.updateSubject)) {
        FIGRadioWidget.forgetAccessor(this._access);
      }
    }
  }

  private _requestAccessor(): FIGRadioAccessor {
    if (this._access && this._access!.groupId === this.groupId) {
      return this._access;
    } else if (this._access) {
      if (this._access.forgetSubject(this.updateSubject)) {
        FIGRadioWidget.forgetAccessor(this._access);
      }
    }
    this._access = FIGRadioWidget._accessors.find((access) => access.groupId === this.groupId);
    if (this._access) {
      this._access.registerSubject(this.updateSubject);
      return this._access;
    }
    this._access = new FIGRadioAccessor(this.groupId);
    this._access.registerSubject(this.updateSubject);
    FIGRadioWidget.registerAccessor(this._access);
    return this._access;
  }
}
