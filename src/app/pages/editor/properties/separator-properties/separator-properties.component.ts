import {Component, DestroyRef, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGSeparatorWidget} from "../../../../models/widgets/separator.widget";

@Component({
  selector: 'fig-separator-properties',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './separator-properties.component.html',
  styleUrl: './separator-properties.component.css'
})
export class SeparatorPropertiesComponent extends AbstractPropertiesComponent<FIGSeparatorWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.dispose();
    this.widget = value as FIGSeparatorWidget;
    this.load();
  }

  protected updateForm(): void {
    if (!this.widget) {
      return;
    }
  }

}
