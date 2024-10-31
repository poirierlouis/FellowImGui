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
}

export type FieldCallback = (value: any) => void;

export class Field<T = unknown> {
  readonly type: FieldType;
  readonly name: string;
  readonly label: string;
  readonly isOptional: boolean;

  value?: T;
  defaultValue?: T;

  private readonly listeners: FieldCallback[];

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

    this.listeners = [];
  }

  get isRequired(): boolean {
    return !this.isOptional;
  }

  public addListener(fn: FieldCallback): void {
    this.listeners.push(fn);
  }

  public removeListener(fn: FieldCallback): void {
    const index: number = this.listeners.findIndex((listener) => listener === fn);

    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public emit(): void {
    for (const listener of this.listeners) {
      listener(this.value);
    }
  }

}
