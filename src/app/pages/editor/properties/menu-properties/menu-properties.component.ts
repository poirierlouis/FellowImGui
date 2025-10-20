import {Component} from "@angular/core";
import type {FIGMenuWidget} from "../../../../models/widgets/menu.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-menu-properties",
  imports: [BoolFieldComponent, StringFieldComponent],
  templateUrl: "./menu-properties.component.html",
  styleUrl: "./menu-properties.component.css",
})
export class MenuPropertiesComponent extends AbstractPropertiesComponent<FIGMenuWidget> {}
