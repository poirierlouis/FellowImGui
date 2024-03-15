import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGSeparatorWidget} from "../../../../models/widgets/separator.widget";

@Component({
  selector: 'fig-separator-properties',
  standalone: true,
  imports: [],
  templateUrl: './separator-properties.component.html',
  styleUrl: './separator-properties.component.css'
})
export class SeparatorPropertiesComponent extends AbstractPropertiesComponent<FIGSeparatorWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected updateForm(): void {
    if (!this.widget) {
      return;
    }
  }

}
