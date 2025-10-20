import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import type {EnumField, EnumFieldType, EnumOption} from "../../../../models/fields/enum.field";
import {AbstractFieldComponent} from "../abstract-field.component";

@Component({
  selector: "fig-enum-field",
  imports: [MatLabel, MatOption, MatSelect, MatFormField, ReactiveFormsModule, MatDivider],
  templateUrl: "./enum-field.component.html",
  styleUrl: "./enum-field.component.css",
})
export class EnumFieldComponent extends AbstractFieldComponent<EnumField<never>, EnumFieldType> {
  readonly options: EnumOption[] = [];

  protected override onFieldLoaded() {
    this.options.length = 0;
    this.options.push(...this.field.options);
  }
}
