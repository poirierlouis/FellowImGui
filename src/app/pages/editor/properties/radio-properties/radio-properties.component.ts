import {Component} from "@angular/core";
import type {FIGRadioWidget} from "../../../../models/widgets/radio.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-radio-properties",
  imports: [StringFieldComponent, IntegerFieldComponent],
  templateUrl: "./radio-properties.component.html",
  styleUrl: "./radio-properties.component.css",
})
export class RadioPropertiesComponent extends AbstractPropertiesComponent<FIGRadioWidget> {}
