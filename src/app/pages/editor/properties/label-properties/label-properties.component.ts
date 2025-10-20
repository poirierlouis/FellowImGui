import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGLabelWidget} from "../../../../models/widgets/label.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-label-properties",
  imports: [ReactiveFormsModule, StringFieldComponent],
  templateUrl: "./label-properties.component.html",
  styleUrl: "./label-properties.component.css",
})
export class LabelPropertiesComponent extends AbstractPropertiesComponent<FIGLabelWidget> {}
