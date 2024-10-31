import {Component, DestroyRef} from '@angular/core';
import {ArrayField} from "../../../../models/fields/array.field";
import {AbstractFieldComponent} from "../abstract-field.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'fig-array-string-field',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './array-string-field.component.html',
  styleUrl: './array-string-field.component.css'
})
export class ArrayStringFieldComponent extends AbstractFieldComponent<ArrayField, string, string[]> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override transformFromForm(value?: string): string[] {
    value ??= '';
    return value.split('\n');
  }

  protected override transformFromField(value?: string[]): string {
    value ??= [];
    return value.join('\n');
  }

}
