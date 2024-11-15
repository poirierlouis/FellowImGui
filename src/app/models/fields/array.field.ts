import {Field, FieldType} from "./field";

export class ArrayField extends Field<unknown[]> {
  constructor(name: string,
              label: string,
              value?: unknown[],
              isOptional: boolean = false,
              defaultValue?: unknown[]) {
    super(FieldType.array, name, label, value, isOptional, defaultValue);
  }
}
