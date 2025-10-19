import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTableRowWidget} from "../../../../models/widgets/table-row.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";

@Component({
  selector: 'fig-table-row-properties',
  standalone: true,
  imports: [
    BoolFieldComponent
  ],
  templateUrl: './table-row-properties.component.html',
  styleUrl: './table-row-properties.component.css'
})
export class TableRowPropertiesComponent extends AbstractPropertiesComponent<FIGTableRowWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
