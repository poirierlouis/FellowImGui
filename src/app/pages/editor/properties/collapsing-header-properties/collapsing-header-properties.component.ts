import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGCollapsingHeaderWidget} from "../../../../models/widgets/collapsing-header.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-collapsing-header-properties',
  standalone: true,
  imports: [
    FlagsFieldComponent,
    StringFieldComponent,
  ],
  templateUrl: './collapsing-header-properties.component.html',
  styleUrl: './collapsing-header-properties.component.css'
})
export class CollapsingHeaderPropertiesComponent extends AbstractPropertiesComponent<FIGCollapsingHeaderWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
