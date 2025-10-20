import {Component} from "@angular/core";
import type {FIGDummyWidget} from "../../../../models/widgets/dummy.widget";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-dummy-properties",
  imports: [SizeFieldComponent, StringFieldComponent],
  templateUrl: "./dummy-properties.component.html",
  styleUrl: "./dummy-properties.component.css",
})
export class DummyPropertiesComponent extends AbstractPropertiesComponent<FIGDummyWidget> {}
