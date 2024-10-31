import {Field, FieldType} from "./field";

export class FloatField extends Field<number> {
  constructor(name: string,
              label: string,
              value?: number,
              isOptional: boolean = false,
              defaultValue?: number) {
    super(FieldType.float, name, label, value, isOptional, defaultValue);
  }
}
