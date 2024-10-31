import {Field, FieldType} from "./field";

export class StringField extends Field<string> {
  constructor(name: string,
              label: string,
              value?: string,
              isOptional: boolean = false,
              defaultValue?: string) {
    super(FieldType.string, name, label, value, isOptional, defaultValue);
  }
}
