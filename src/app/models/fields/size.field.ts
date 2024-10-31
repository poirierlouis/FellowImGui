import {Field, FieldType} from "./field";
import {Size} from "../math";

export class SizeField extends Field<Size> {
  readonly acceptRelative: boolean;

  constructor(name: string,
              label: string,
              acceptRelative: boolean = false,
              value?: Size,
              isOptional: boolean = false,
              defaultValue?: Size) {
    super(FieldType.size, name, label, value, isOptional, defaultValue);
    this.acceptRelative = acceptRelative;
  }

  public get isPercentage(): boolean {
    if (!this.value) {
      return false;
    }
    return (this.value.width > 0.0 && this.value.width <= 1.0) ||
           (this.value.height > 0.0 && this.value.height <= 1.0);
  }
}
