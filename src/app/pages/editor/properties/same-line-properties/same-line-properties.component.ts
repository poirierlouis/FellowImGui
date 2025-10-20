import {Component} from "@angular/core";
import type {FIGSameLineWidget} from "../../../../models/widgets/same-line.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-same-line-properties",
  imports: [IntegerFieldComponent],
  templateUrl: "./same-line-properties.component.html",
  styleUrl: "./same-line-properties.component.css",
})
export class SameLinePropertiesComponent extends AbstractPropertiesComponent<FIGSameLineWidget> {}
