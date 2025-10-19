import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGChildWindowWidget} from "../../../../models/widgets/child-window.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-child-window-properties',
  standalone: true,
  imports: [
    BoolFieldComponent,
    SizeFieldComponent,
    FlagsFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './child-window-properties.component.html',
  styleUrl: './child-window-properties.component.css'
})
export class ChildWindowPropertiesComponent extends AbstractPropertiesComponent<FIGChildWindowWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
