import {Field, FieldType} from "./field";

export class BoolField extends Field<boolean> {
  constructor(name: string,
              label: string,
              value?: boolean,
              isOptional: boolean = false,
              defaultValue?: boolean) {
    super(FieldType.bool, name, label, value, isOptional, defaultValue);
  }
}
