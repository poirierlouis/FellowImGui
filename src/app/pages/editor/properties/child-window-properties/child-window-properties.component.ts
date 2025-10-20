import {Component} from "@angular/core";
import type {FIGChildWindowWidget} from "../../../../models/widgets/child-window.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-child-window-properties",
  imports: [BoolFieldComponent, SizeFieldComponent, FlagsFieldComponent, StringFieldComponent],
  templateUrl: "./child-window-properties.component.html",
  styleUrl: "./child-window-properties.component.css",
})
export class ChildWindowPropertiesComponent extends AbstractPropertiesComponent<FIGChildWindowWidget> {}
