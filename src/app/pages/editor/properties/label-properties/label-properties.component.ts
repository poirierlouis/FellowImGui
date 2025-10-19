import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGLabelWidget} from "../../../../models/widgets/label.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";

@Component({
    selector: 'fig-label-properties',
    imports: [
        ReactiveFormsModule,
        StringFieldComponent
    ],
    templateUrl: './label-properties.component.html',
    styleUrl: './label-properties.component.css'
})
export class LabelPropertiesComponent extends AbstractPropertiesComponent<FIGLabelWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
