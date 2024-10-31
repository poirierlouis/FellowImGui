import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {AbstractFieldComponent} from "../abstract-field.component";
import {StringField} from "../../../../models/fields/string.field";

@Component({
  selector: 'fig-string-field',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './string-field.component.html',
  styleUrl: './string-field.component.css'
})
export class StringFieldComponent extends AbstractFieldComponent<StringField, string> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override transformFromForm(value?: string): string | undefined {
    value = value?.trim();
    return value;
  }

}
