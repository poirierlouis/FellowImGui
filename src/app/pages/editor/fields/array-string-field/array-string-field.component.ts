import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import type {ArrayField} from "../../../../models/fields/array.field";
import {AbstractFieldComponent} from "../abstract-field.component";

@Component({
  selector: "fig-array-string-field",
  imports: [MatLabel, MatInput, MatFormField, ReactiveFormsModule, CdkTextareaAutosize],
  templateUrl: "./array-string-field.component.html",
  styleUrl: "./array-string-field.component.css",
})
export class ArrayStringFieldComponent extends AbstractFieldComponent<ArrayField, string, string[]> {
  protected override transformFromForm(value?: string): string[] {
    value ??= "";
    return value.split("\n");
  }

  protected override transformFromField(value?: string[]): string {
    value ??= [];
    return value.join("\n");
  }
}
