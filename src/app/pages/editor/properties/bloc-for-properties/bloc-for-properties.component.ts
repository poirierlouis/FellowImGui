import {Component} from "@angular/core";
import type {FIGBlocForWidget} from "../../../../models/widgets/bloc-for.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-bloc-for-properties",
  imports: [IntegerFieldComponent],
  templateUrl: "./bloc-for-properties.component.html",
  styleUrl: "./bloc-for-properties.component.css",
})
export class BlocForPropertiesComponent extends AbstractPropertiesComponent<FIGBlocForWidget> {}
