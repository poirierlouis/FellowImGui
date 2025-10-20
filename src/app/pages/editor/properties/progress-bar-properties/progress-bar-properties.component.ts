import {Component} from "@angular/core";
import {MatSliderModule} from "@angular/material/slider";
import type {FIGProgressBarWidget} from "../../../../models/widgets/progress-bar.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-progress-bar-properties",
  imports: [MatSliderModule, BoolFieldComponent, StringFieldComponent, IntegerFieldComponent],
  templateUrl: "./progress-bar-properties.component.html",
  styleUrl: "./progress-bar-properties.component.css",
})
export class ProgressBarPropertiesComponent extends AbstractPropertiesComponent<FIGProgressBarWidget> {}
