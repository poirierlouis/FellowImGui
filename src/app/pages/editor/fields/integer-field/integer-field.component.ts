import {Component, DestroyRef, Input, numberAttribute, OnChanges, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractFieldComponent} from "../abstract-field.component";
import {IntegerField} from "../../../../models/fields/integer.field";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";

@Component({
  selector: 'fig-integer-field',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSlider,
    MatFormField,
    MatSliderThumb,
    ReactiveFormsModule
  ],
  templateUrl: './integer-field.component.html',
  styleUrl: './integer-field.component.css'
})
export class IntegerFieldComponent extends AbstractFieldComponent<IntegerField, number | undefined> implements OnChanges {

  type: 'field' | 'percentage' = 'field';

  @Input({transform: numberAttribute})
  min: number | null = null;

  @Input({transform: numberAttribute})
  max: number | null = null;

  @Input({transform: numberAttribute})
  step: number | null = null;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  @Input('type')
  set _type(value: 'field' | 'percentage') {
    this.type = value;
    if (value === 'percentage') {
      this.format = (value: number) => `${value.toFixed(0)}%`;
    }
  }

  @Input()
  format: (value: number) => string = (value) => value.toString();

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

  protected override transformFromForm(value?: number): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (this.type === 'percentage') {
      value /= 100;
    }
    return value;
  }

  protected override transformFromField(value?: number): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (this.type === 'percentage') {
      value *= 100;
    }
    return value;
  }

}
