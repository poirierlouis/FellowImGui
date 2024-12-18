import {FIGWidget, FIGWidgetType} from "./widget";
import {BehaviorSubject} from "rxjs";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export class FIGRadioAccessor {
  readonly groupId: string;
  readonly subjects: BehaviorSubject<void>[];

  value: number = 0;

  constructor(groupId: string) {
    this.groupId = groupId;
    this.subjects = [];
  }

  access = (_ = this.value) => this.value = _;

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
    return this.subjects.length === 0;
  }
}

export interface FIGRadioOptions extends FIGTooltipOption {
  readonly groupId?: string;
  readonly label?: string;
  readonly index?: number;
}

export class FIGRadioWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'groupId'},
    {name: 'label'},
    {name: 'tooltip', optional: true, default: undefined},
    {name: 'index', optional: true, default: 0}
  ];

  private static readonly _accessors: FIGRadioAccessor[] = [];

  groupId: string;
  label: string;
  index: number = 0;

  private _access?: FIGRadioAccessor;

  constructor(options?: FIGRadioOptions) {
    super(FIGWidgetType.radio, true);
    this.groupId = options?.groupId ?? 'RadioGroup';
    this.label = options?.label ?? 'Radio';
    this.tooltip = options?.tooltip;
    this.index = options?.index ?? 0;
  }

  public get name(): string {
    return this.label;
  }

  public get value(): number {
    return this._access ? this._access!.access() : -1;
  }

  public static filterByGroupId(widget: FIGWidget, groupId: string): boolean {
    return widget.type === FIGWidgetType.radio && (widget as FIGRadioWidget).groupId === groupId;
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

    ImGui.RadioButton(this.label, this._access!.access, this.index);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
    if (prevValue !== this.value) {
      accessor.update();
    }
  }

  public override onCreated(): void {
    super.onCreated();
    if (!this.parent) {
      return;
    }
    const sibling: FIGRadioWidget | undefined = this.parent.findPreviousSibling(this, (widget) => {
      return widget.type === FIGWidgetType.radio;
    });

    if (!sibling) {
      return;
    }
    this.groupId = sibling.groupId;
    this.index = sibling.index + 1;
  }

  public override onDeleted() {
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
