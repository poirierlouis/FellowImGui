import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTabItemWidget} from "../../../../models/widgets/tab-item.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
    selector: 'fig-tab-item-properties',
    imports: [
        FlagsFieldComponent,
        ReactiveFormsModule,
        StringFieldComponent
    ],
    templateUrl: './tab-item-properties.component.html',
    styleUrl: './tab-item-properties.component.css'
})
export class TabItemPropertiesComponent extends AbstractPropertiesComponent<FIGTabItemWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
