import {Field, FieldType} from "./field";

export class Number4Field extends Field<number[]> {
  constructor(name: string, label: string, value: number[], isOptional: boolean = false, defaultValue?: number[]) {
    super(FieldType.number4, name, label, value, isOptional, defaultValue);
  }

  public override isEqual(other: number[]): boolean {
    return !!this.value?.every((v, i) => v === other[i]);
  }
}
