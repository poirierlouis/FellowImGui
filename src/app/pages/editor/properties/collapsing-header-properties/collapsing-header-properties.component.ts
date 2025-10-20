import {Component} from "@angular/core";
import type {FIGCollapsingHeaderWidget} from "../../../../models/widgets/collapsing-header.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-collapsing-header-properties",
  imports: [FlagsFieldComponent, StringFieldComponent],
  templateUrl: "./collapsing-header-properties.component.html",
  styleUrl: "./collapsing-header-properties.component.css",
})
export class CollapsingHeaderPropertiesComponent extends AbstractPropertiesComponent<FIGCollapsingHeaderWidget> {}
