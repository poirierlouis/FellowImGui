import {Component, Input, numberAttribute, type OnChanges, type SimpleChanges} from "@angular/core";
import {ReactiveFormsModule, type ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import type {IntegerField} from "../../../../models/fields/integer.field";
import {AbstractFieldComponent} from "../abstract-field.component";

@Component({
  selector: "fig-integer-field",
  imports: [MatInput, MatLabel, MatSlider, MatFormField, MatSliderThumb, ReactiveFormsModule],
  templateUrl: "./integer-field.component.html",
  styleUrl: "./integer-field.component.css",
})
export class IntegerFieldComponent
  extends AbstractFieldComponent<IntegerField, number | undefined>
  implements OnChanges
{
  type: "field" | "percentage" = "field";

  @Input({transform: numberAttribute})
  min: number | null = null;

  @Input({transform: numberAttribute})
  max: number | null = null;

  @Input({transform: numberAttribute})
  step: number | null = null;

  @Input("type")
  set _type(value: "field" | "percentage") {
    this.type = value;
    if (value === "percentage") {
      this.format = (value: number) => `${value.toFixed(0)}%`;
    }
  }

  @Input()
  format: (value: number) => string = (value) => value.toString();

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

  protected override transformFromForm(value?: number): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (this.type === "percentage") {
      value /= 100;
    }
    return value;
  }

  protected override transformFromField(value?: number): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (this.type === "percentage") {
      value *= 100;
    }
    return value;
  }
}
