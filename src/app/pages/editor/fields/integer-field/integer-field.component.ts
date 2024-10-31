import {Component, DestroyRef, Input, numberAttribute} from '@angular/core';
import {ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractFieldComponent} from "../abstract-field.component";
import {IntegerField} from "../../../../models/fields/integer.field";

@Component({
  selector: 'fig-integer-field',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './integer-field.component.html',
  styleUrl: './integer-field.component.css'
})
export class IntegerFieldComponent extends AbstractFieldComponent<IntegerField, number> {

  @Input({required: true, transform: numberAttribute})
  min: number = 0;

  @Input({required: true, transform: numberAttribute})
  step: number = 1;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override getValidators(): ValidatorFn[] {
    return [
      ...super.getValidators(),
      Validators.min(this.min),
    ];
  }

}
