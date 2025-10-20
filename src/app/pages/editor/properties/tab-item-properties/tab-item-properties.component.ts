import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGTabItemWidget} from "../../../../models/widgets/tab-item.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-tab-item-properties",
  imports: [FlagsFieldComponent, ReactiveFormsModule, StringFieldComponent],
  templateUrl: "./tab-item-properties.component.html",
  styleUrl: "./tab-item-properties.component.css",
})
export class TabItemPropertiesComponent extends AbstractPropertiesComponent<FIGTabItemWidget> {}
