import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGSameLineWidget} from "../../../../models/widgets/same-line.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";

@Component({
  selector: 'fig-same-line-properties',
  standalone: true,
  imports: [
    IntegerFieldComponent
  ],
  templateUrl: './same-line-properties.component.html',
  styleUrl: './same-line-properties.component.css'
})
export class SameLinePropertiesComponent extends AbstractPropertiesComponent<FIGSameLineWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
