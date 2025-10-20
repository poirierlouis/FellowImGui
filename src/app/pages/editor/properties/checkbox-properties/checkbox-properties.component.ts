import {Component} from "@angular/core";
import type {FIGCheckboxWidget} from "../../../../models/widgets/checkbox.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-checkbox-properties",
  imports: [BoolFieldComponent, StringFieldComponent],
  templateUrl: "./checkbox-properties.component.html",
  styleUrl: "./checkbox-properties.component.css",
})
export class CheckboxPropertiesComponent extends AbstractPropertiesComponent<FIGCheckboxWidget> {}
