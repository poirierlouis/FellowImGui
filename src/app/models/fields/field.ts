export enum FieldType {
  bool,
  integer,
  float,
  number,
  string,
  array,
  size,
  flags,
  color,
  enum,
  number4,
}

export type FieldValueCallback = (value: any) => void;
export type FieldStateCallback = (isDisabled: boolean) => void;

export interface FieldListener {
  readonly callback: FieldValueCallback;
  readonly state?: FieldStateCallback;
}

export class Field<T = unknown> {
  readonly type: FieldType;
  readonly name: string;
  readonly label: string;
  readonly isOptional: boolean;

  value?: T;
  defaultValue?: T;

  private readonly listeners: FieldListener[];
  private isEnabled: boolean;

  protected constructor(type: FieldType,
                        name: string,
                        label: string,
                        value?: T,
                        isOptional: boolean = false,
                        defaultValue?: T) {
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = value;
    this.isOptional = isOptional;
    this.defaultValue = defaultValue;
    this.isEnabled = true;

    this.listeners = [];
  }

  get isRequired(): boolean {
    return !this.isOptional;
  }

  get isDisabled(): boolean {
    return !this.isEnabled;
  }

  public isEqual(other: T): boolean {
    return this.value === other;
  }

  public addListener(fn: FieldValueCallback, state?: FieldStateCallback): void {
    this.listeners.push({
      callback: fn,
      state: state
    });
  }

  public removeListener(fn: FieldValueCallback, state?: FieldStateCallback): void {
    const index: number = this.listeners.findIndex((listener) => listener.callback === fn && listener.state === state);

    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public enable(): void {
    this.isEnabled = true;
    for (const listener of this.listeners) {
      listener.state?.(false);
    }
  }

  public disable(): void {
    this.isEnabled = false;
    for (const listener of this.listeners) {
      listener.state?.(true);
    }
  }

  public emit(): void {
    for (const listener of this.listeners) {
      listener.callback(this.value);
    }
  }

}
