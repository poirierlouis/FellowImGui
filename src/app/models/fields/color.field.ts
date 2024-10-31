import {Field, FieldType} from "./field";
import {Color} from "../math";

export class ColorField extends Field<Color> {
  constructor(name: string,
              label: string,
              value?: Color,
              isOptional: boolean = false,
              defaultValue?: Color) {
    super(FieldType.color, name, label, value, isOptional, defaultValue);
  }
}
