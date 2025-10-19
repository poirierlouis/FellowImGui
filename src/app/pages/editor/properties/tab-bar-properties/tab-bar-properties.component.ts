import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTabBarWidget} from "../../../../models/widgets/tab-bar.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
    selector: 'fig-tab-bar-properties',
    imports: [
        FlagsFieldComponent,
        ReactiveFormsModule,
        StringFieldComponent
    ],
    templateUrl: './tab-bar-properties.component.html',
    styleUrl: './tab-bar-properties.component.css'
})
export class TabBarPropertiesComponent extends AbstractPropertiesComponent<FIGTabBarWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
