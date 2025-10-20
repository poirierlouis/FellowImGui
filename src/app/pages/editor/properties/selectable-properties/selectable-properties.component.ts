import {Component} from "@angular/core";
import type {FIGSelectableWidget} from "../../../../models/widgets/selectable.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-selectable-properties",
  imports: [SizeFieldComponent, FlagsFieldComponent, StringFieldComponent, BoolFieldComponent],
  templateUrl: "./selectable-properties.component.html",
  styleUrl: "./selectable-properties.component.css",
})
export class SelectablePropertiesComponent extends AbstractPropertiesComponent<FIGSelectableWidget> {}
