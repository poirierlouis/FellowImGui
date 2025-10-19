import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGPlotWidget} from "../../../../models/widgets/plot.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {NumberFieldComponent} from "../../fields/number-field/number-field.component";

@Component({
  selector: 'fig-plot-properties',
  standalone: true,
  imports: [
    EnumFieldComponent,
    SizeFieldComponent,
    ReactiveFormsModule,
    StringFieldComponent,
    NumberFieldComponent,
    IntegerFieldComponent
  ],
  templateUrl: './plot-properties.component.html',
  styleUrl: './plot-properties.component.css'
})
export class PlotPropertiesComponent extends AbstractPropertiesComponent<FIGPlotWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
