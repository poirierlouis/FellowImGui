import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import type {BoolField} from "../../../../models/fields/bool.field";
import {AbstractFieldComponent} from "../abstract-field.component";

@Component({
  selector: "fig-bool-field",
  imports: [MatLabel, MatSlideToggle, ReactiveFormsModule],
  templateUrl: "./bool-field.component.html",
  styleUrl: "./bool-field.component.css",
})
export class BoolFieldComponent extends AbstractFieldComponent<BoolField, boolean> {}
