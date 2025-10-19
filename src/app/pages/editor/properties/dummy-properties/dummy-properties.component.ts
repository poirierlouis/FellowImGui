import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGDummyWidget} from "../../../../models/widgets/dummy.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";

@Component({
  selector: 'fig-dummy-properties',
  standalone: true,
  imports: [
    SizeFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './dummy-properties.component.html',
  styleUrl: './dummy-properties.component.css'
})
export class DummyPropertiesComponent extends AbstractPropertiesComponent<FIGDummyWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
