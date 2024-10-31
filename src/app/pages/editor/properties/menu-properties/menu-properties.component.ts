import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGMenuWidget} from "../../../../models/widgets/menu.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";

@Component({
  selector: 'fig-menu-properties',
  standalone: true,
  imports: [
    BoolFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './menu-properties.component.html',
  styleUrl: './menu-properties.component.css'
})
export class MenuPropertiesComponent extends AbstractPropertiesComponent<FIGMenuWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
