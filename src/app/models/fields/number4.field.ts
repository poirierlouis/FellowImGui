import {Field, FieldType} from "./field";

export class Number4Field extends Field<number[]> {
  constructor(name: string, label: string, value: number[], isOptional: boolean = false, defaultValue?: number[]) {
    super(FieldType.number4, name, label, value, isOptional, defaultValue);
  }

  public override isEqual(other?: number[]): boolean {
    return other?.length === this.value?.length && !!other?.every((v, i) => v === this.value?.[i]);
  }
}
