import {Component, Input, numberAttribute, type OnChanges, type SimpleChanges} from "@angular/core";
import {ReactiveFormsModule, type ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import type {NumberField} from "../../../../models/fields/number.field";
import {AbstractFieldComponent} from "../abstract-field.component";

@Component({
  selector: "fig-number-field",
  imports: [MatInput, MatLabel, MatFormField, ReactiveFormsModule],
  templateUrl: "./number-field.component.html",
  styleUrl: "./number-field.component.css",
})
export class NumberFieldComponent extends AbstractFieldComponent<NumberField, number> implements OnChanges {
  @Input({transform: numberAttribute})
  min: number | null = null;

  @Input({transform: numberAttribute})
  max: number | null = null;

  @Input({required: true, transform: numberAttribute})
  step: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["min"] || changes["max"]) {
      this.form.setValidators(this.getValidators());
      this.form.updateValueAndValidity();
    }
  }

  protected override getValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.getValidators();

    if (this.min !== null) {
      validators.push(Validators.min(this.min));
    }
    if (this.max !== null) {
      validators.push(Validators.max(this.max));
    }
    return validators;
  }
}
