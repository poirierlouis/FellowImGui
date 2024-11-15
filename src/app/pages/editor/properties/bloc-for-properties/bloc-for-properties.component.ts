import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGBlocForWidget} from "../../../../models/widgets/bloc-for.widget";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";

@Component({
  selector: 'fig-bloc-for-properties',
  standalone: true,
  imports: [
    IntegerFieldComponent
  ],
  templateUrl: './bloc-for-properties.component.html',
  styleUrl: './bloc-for-properties.component.css'
})
export class BlocForPropertiesComponent extends AbstractPropertiesComponent<FIGBlocForWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
