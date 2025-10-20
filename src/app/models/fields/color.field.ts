import type {Color} from "../math";
import {Field, FieldType} from "./field";

export class ColorField extends Field<Color> {
  constructor(name: string, label: string, value?: Color, isOptional: boolean = false, defaultValue?: Color) {
    super(FieldType.color, name, label, value, isOptional, defaultValue);
  }

  override isEqual(other?: Color): boolean {
    return (
      this.value?.r === other?.r &&
      this.value?.g === other?.g &&
      this.value?.b === other?.b &&
      this.value?.a === other?.a
    );
  }
}
