import {booleanAttribute, Component, DestroyRef, Input} from '@angular/core';
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {AbstractFieldComponent} from "../abstract-field.component";
import {StringField} from "../../../../models/fields/string.field";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
    selector: 'fig-string-field',
    imports: [
        MatInput,
        MatLabel,
        MatPrefix,
        MatFormField,
        ReactiveFormsModule,
        CdkTextareaAutosize
    ],
    templateUrl: './string-field.component.html',
    styleUrl: './string-field.component.css'
})
export class StringFieldComponent extends AbstractFieldComponent<StringField, string> {

  @Input()
  prefix: string | null = null;

  @Input({transform: booleanAttribute})
  textarea: boolean = false;

  @Input({transform: booleanAttribute})
  readonly: boolean = false;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override transformFromForm(value?: string): string | undefined {
    value = value?.trim();
    if (this.prefix) {
      value = this.prefix + value;
    }
    return value;
  }

  protected override transformFromField(value?: string | undefined): string {
    value = value?.trim();
    if (this.prefix) {
      value = value?.slice(2);
    }
    return value ?? '';
  }

}
