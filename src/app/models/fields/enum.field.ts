import {Field, FieldType} from "./field";

export type EnumFieldType = string | number;

export interface EnumOption {
  readonly value: number;
  readonly label: string;
}

export class EnumField<T extends EnumFieldType> extends Field<T> {
  public readonly options: EnumOption[];

  constructor(name: string,
              label: string,
              options: EnumOption[],
              value?: T,
              isOptional: boolean = false,
              defaultValue?: T) {
    super(FieldType.enum, name, label, value, isOptional, defaultValue);
    this.options = options;
  }
}
