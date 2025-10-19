import {Component, DestroyRef, Input, numberAttribute, OnChanges, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractFieldComponent} from "../abstract-field.component";
import {NumberField} from "../../../../models/fields/number.field";

@Component({
  selector: 'fig-number-field',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './number-field.component.html',
  styleUrl: './number-field.component.css'
})
export class NumberFieldComponent extends AbstractFieldComponent<NumberField, number> implements OnChanges {

  @Input({transform: numberAttribute})
  min: number | null = null;

  @Input({transform: numberAttribute})
  max: number | null = null;

  @Input({required: true, transform: numberAttribute})
  step: number = 1;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max']) {
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
