import {Field, FieldType} from "./field";
import {EnumFieldType} from "./enum.field";

export interface FlagOption {
  readonly value: number;
  readonly label: string;
}

export function getOptions(flags: Record<EnumFieldType, EnumFieldType>): FlagOption[] {
  return Object.keys(flags)
    .filter((key: EnumFieldType) => !isNaN(Number(key)))
    .map((key: EnumFieldType) => {
      return {
        value: Number.parseInt(key as string),
        label: flags[key]
      } as FlagOption;
    });
}

export class FlagsField extends Field<number> {
  readonly options: FlagOption[];

  constructor(name: string,
              label: string,
              options: FlagOption[],
              value?: number,
              isOptional: boolean = false,
              defaultValue?: number) {
    super(FieldType.flags, name, label, value, isOptional, defaultValue);
    this.options = options;
  }

  public on(mask: number): void {
    if (this.value === undefined) {
      return;
    }
    this.value |= mask;
    this.emit();
  }

  public off(mask: number): void {
    if (this.value === undefined) {
      return;
    }
    this.value &= ~mask;
    this.emit();
  }
}
