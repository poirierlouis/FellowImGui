import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGInputColorEditFlags, FIGInputColorEditWidget} from "../../../../models/widgets/input-color-edit.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {ColorFieldComponent} from "../../fields/color-field/color-field.component";
import {Color} from "../../../../models/math";
import {FlagsField} from "../../../../models/fields/flags.field";

@Component({
  selector: 'fig-input-color-edit-properties',
  standalone: true,
  imports: [
    BoolFieldComponent,
    ColorFieldComponent,
    FlagsFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './input-color-edit-properties.component.html',
  styleUrl: './input-color-edit-properties.component.css'
})
export class InputColorEditPropertiesComponent extends AbstractPropertiesComponent<FIGInputColorEditWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  private onColorChanged(value?: Color): void {
    if (!value) {
      return;
    }
    if (value.a >= 1.0) {
      return;
    }
    this.widget.withAlpha = true;
  }

  private onWithAlphaChanged(value: boolean): void {
    const color: Color = {...this.widget.color};
    const field: FlagsField = this.getField('flags') as FlagsField;

    if (!value) {
      color.a = 1.0;
      field.disable(FIGInputColorEditFlags.AlphaBar);
      field.disable(FIGInputColorEditFlags.AlphaPreviewHalf);
    } else {
      color.a = 0.5;
      field.disable(FIGInputColorEditFlags.NoAlpha);
      field.enable(FIGInputColorEditFlags.AlphaBar);
      field.enable(FIGInputColorEditFlags.AlphaPreviewHalf);
    }
    this.widget.color = color;
  }

}
