import {Field, FieldType} from "./field";

export class NumberField extends Field<number> {
  constructor(name: string,
              label: string,
              value?: number,
              isOptional: boolean = false,
              defaultValue?: number) {
    super(FieldType.number, name, label, value, isOptional, defaultValue);
  }
}
