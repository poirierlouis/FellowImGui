import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {AbstractFieldComponent} from "../abstract-field.component";
import {EnumField, EnumFieldType, EnumOption} from "../../../../models/fields/enum.field";

@Component({
  selector: 'fig-enum-field',
  standalone: true,
  imports: [
    MatLabel,
    MatOption,
    MatSelect,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './enum-field.component.html',
  styleUrl: './enum-field.component.css'
})
export class EnumFieldComponent extends AbstractFieldComponent<EnumField<never>, EnumFieldType> {

  public readonly options: EnumOption[] = [];

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override onFieldLoaded() {
    this.options.length = 0;
    this.options.push(...this.field.options);
  }
}
