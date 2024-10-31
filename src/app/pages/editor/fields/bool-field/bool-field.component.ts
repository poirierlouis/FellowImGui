import {Component, DestroyRef} from '@angular/core';
import {AbstractFieldComponent} from "../abstract-field.component";
import {BoolField} from "../../../../models/fields/bool.field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-bool-field',
  standalone: true,
  imports: [
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './bool-field.component.html',
  styleUrl: './bool-field.component.css'
})
export class BoolFieldComponent extends AbstractFieldComponent<BoolField, boolean> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
