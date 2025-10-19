import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGCheckboxWidget} from "../../../../models/widgets/checkbox.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";

@Component({
  selector: 'fig-checkbox-properties',
  standalone: true,
  imports: [
    BoolFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './checkbox-properties.component.html',
  styleUrl: './checkbox-properties.component.css'
})
export class CheckboxPropertiesComponent extends AbstractPropertiesComponent<FIGCheckboxWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
