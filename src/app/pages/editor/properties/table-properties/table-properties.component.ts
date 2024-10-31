import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTableWidget} from "../../../../models/widgets/table.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-table-properties',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlagsFieldComponent,
    StringFieldComponent,
    IntegerFieldComponent
  ],
  templateUrl: './table-properties.component.html',
  styleUrl: './table-properties.component.css'
})
export class TablePropertiesComponent extends AbstractPropertiesComponent<FIGTableWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
