import {Component} from "@angular/core";
import type {FIGTableRowWidget} from "../../../../models/widgets/table-row.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-table-row-properties",
  imports: [BoolFieldComponent],
  templateUrl: "./table-row-properties.component.html",
  styleUrl: "./table-row-properties.component.css",
})
export class TableRowPropertiesComponent extends AbstractPropertiesComponent<FIGTableRowWidget> {}
