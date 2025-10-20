import {Component} from "@angular/core";
import type {FlagsField} from "../../../../models/fields/flags.field";
import type {Color} from "../../../../models/math";
import {FIGInputColorEditFlags, type FIGInputColorEditWidget} from "../../../../models/widgets/input-color-edit.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {ColorFieldComponent} from "../../fields/color-field/color-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-input-color-edit-properties",
  imports: [BoolFieldComponent, ColorFieldComponent, FlagsFieldComponent, StringFieldComponent],
  templateUrl: "./input-color-edit-properties.component.html",
  styleUrl: "./input-color-edit-properties.component.css",
})
export class InputColorEditPropertiesComponent extends AbstractPropertiesComponent<FIGInputColorEditWidget> {
  private onColorChanged(value?: Color): void {
    if (!value) {
      return;
    }
    if (value.a >= 1.0) {
      return;
    }
    this.widget.withAlpha = true;
  }

  private onWithAlphaChanged(withAlpha: boolean): void {
    const color: Color = {...this.widget.color};
    const field: FlagsField = this.getField("flags") as FlagsField;

    if (!withAlpha) {
      color.a = 1.0;
      field.off(FIGInputColorEditFlags.AlphaBar);
      field.off(FIGInputColorEditFlags.AlphaPreviewHalf);
    } else {
      color.a = 0.5;
      field.off(FIGInputColorEditFlags.NoAlpha);
      field.on(FIGInputColorEditFlags.AlphaBar);
      field.on(FIGInputColorEditFlags.AlphaPreviewHalf);
    }
    this.widget.color = color;
  }
}
