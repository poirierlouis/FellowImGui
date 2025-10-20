import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGPlotWidget} from "../../../../models/widgets/plot.widget";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {NumberFieldComponent} from "../../fields/number-field/number-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-plot-properties",
  imports: [
    EnumFieldComponent,
    SizeFieldComponent,
    ReactiveFormsModule,
    StringFieldComponent,
    NumberFieldComponent,
    IntegerFieldComponent,
  ],
  templateUrl: "./plot-properties.component.html",
  styleUrl: "./plot-properties.component.css",
})
export class PlotPropertiesComponent extends AbstractPropertiesComponent<FIGPlotWidget> {}
