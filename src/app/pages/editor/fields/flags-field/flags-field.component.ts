import {Component, DestroyRef} from '@angular/core';
import {AbstractFieldComponent} from "../abstract-field.component";
import {FlagOption, FlagsField} from "../../../../models/fields/flags.field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'fig-flags-field',
  standalone: true,
  imports: [
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './flags-field.component.html',
  styleUrl: './flags-field.component.css'
})
export class FlagsFieldComponent extends AbstractFieldComponent<FlagsField, number[], number> {

  readonly flags: FlagOption[] = [];

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override transformFromForm(value?: number[]): number {
    let flags: number = 0;

    if (value === undefined || value.length === 0) {
      return flags;
    }
    for (const option of this.field.options) {
      const isEnabled: boolean = value.includes(option.value);

      if (isEnabled) {
        flags |= option.value;
      }
    }
    return flags;
  }

  protected override transformFromField(value?: number): number[] {
    const flags: number[] = [];

    if (value === undefined) {
      return [];
    }
    for (const option of this.field.options) {
      if (((value as number) & option.value) === option.value) {
        flags.push(option.value);
      }
    }
    return flags;
  }

  protected override onFieldLoaded() {
    this.flags.length = 0;
    this.flags.push(...this.field.options);
  }

}
