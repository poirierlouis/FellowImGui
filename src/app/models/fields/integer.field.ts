import {Field, FieldType} from "./field";

export class IntegerField extends Field<number> {
  constructor(name: string,
              label: string,
              value?: number,
              isOptional: boolean = false,
              defaultValue?: number) {
    super(FieldType.integer, name, label, value, isOptional, defaultValue);
  }
}
