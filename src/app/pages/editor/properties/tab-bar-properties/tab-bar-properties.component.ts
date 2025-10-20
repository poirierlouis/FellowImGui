import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGTabBarWidget} from "../../../../models/widgets/tab-bar.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-tab-bar-properties",
  imports: [FlagsFieldComponent, ReactiveFormsModule, StringFieldComponent],
  templateUrl: "./tab-bar-properties.component.html",
  styleUrl: "./tab-bar-properties.component.css",
})
export class TabBarPropertiesComponent extends AbstractPropertiesComponent<FIGTabBarWidget> {}
