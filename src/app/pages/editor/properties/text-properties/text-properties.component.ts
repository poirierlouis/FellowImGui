import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {FIGTextWidget} from "../../../../models/widgets/text.widget";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {ColorFieldComponent} from "../../fields/color-field/color-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";

@Component({
    selector: 'fig-text-properties',
    imports: [
        BoolFieldComponent,
        ColorFieldComponent,
        ReactiveFormsModule,
        StringFieldComponent
    ],
    templateUrl: './text-properties.component.html',
    styleUrl: './text-properties.component.css'
})
export class TextPropertiesComponent extends AbstractPropertiesComponent<FIGTextWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
