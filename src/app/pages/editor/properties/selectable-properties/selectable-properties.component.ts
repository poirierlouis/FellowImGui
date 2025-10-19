import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGSelectableWidget} from "../../../../models/widgets/selectable.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";

@Component({
    selector: 'fig-selectable-properties',
    imports: [
        SizeFieldComponent,
        FlagsFieldComponent,
        StringFieldComponent,
        BoolFieldComponent
    ],
    templateUrl: './selectable-properties.component.html',
    styleUrl: './selectable-properties.component.css'
})
export class SelectablePropertiesComponent extends AbstractPropertiesComponent<FIGSelectableWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
