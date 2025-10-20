import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGTableWidget} from "../../../../models/widgets/table.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-table-properties",
  imports: [ReactiveFormsModule, FlagsFieldComponent, StringFieldComponent, IntegerFieldComponent],
  templateUrl: "./table-properties.component.html",
  styleUrl: "./table-properties.component.css",
})
export class TablePropertiesComponent extends AbstractPropertiesComponent<FIGTableWidget> {}
