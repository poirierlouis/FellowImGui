import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGProgressBarWidget} from "../../../../models/widgets/progress-bar.widget";
import {MatSliderModule} from "@angular/material/slider";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";

@Component({
    selector: 'fig-progress-bar-properties',
    imports: [
        MatSliderModule,
        BoolFieldComponent,
        StringFieldComponent,
        IntegerFieldComponent
    ],
    templateUrl: './progress-bar-properties.component.html',
    styleUrl: './progress-bar-properties.component.css'
})
export class ProgressBarPropertiesComponent extends AbstractPropertiesComponent<FIGProgressBarWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
