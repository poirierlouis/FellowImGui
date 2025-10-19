import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGRadioWidget} from "../../../../models/widgets/radio.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";

@Component({
    selector: 'fig-radio-properties',
    imports: [
        StringFieldComponent,
        IntegerFieldComponent
    ],
    templateUrl: './radio-properties.component.html',
    styleUrl: './radio-properties.component.css'
})
export class RadioPropertiesComponent extends AbstractPropertiesComponent<FIGRadioWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
