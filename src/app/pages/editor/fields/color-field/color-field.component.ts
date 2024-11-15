import {Component, DestroyRef, ViewChild} from '@angular/core';
import {MatLabel} from "@angular/material/form-field";
import {NgxColorsModule, NgxColorsTriggerDirective} from "ngx-colors";
import {AbstractFieldComponent} from "../abstract-field.component";
import {ColorField} from "../../../../models/fields/color.field";
import {PanelComponent} from "ngx-colors/lib/components/panel/panel.component";
import {Color, parseHEX, parseRGBA, stringifyHEX, stringifyRGBA} from "../../../../models/math";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'fig-color-field',
  standalone: true,
  imports: [
    MatLabel,
    NgxColorsModule,
    ReactiveFormsModule
  ],
  templateUrl: './color-field.component.html',
  styleUrl: './color-field.component.css'
})
export class ColorFieldComponent extends AbstractFieldComponent<ColorField, string | undefined, Color | undefined> {

  private static defaultColor: Color = {r: 0.5, g: 0.5, b: 0.5, a: 1.0};

  @ViewChild(NgxColorsTriggerDirective)
  ngxColor!: NgxColorsTriggerDirective;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  private get $panel(): PanelComponent | undefined {
    return this.ngxColor.panelRef?.instance;
  }

  protected override transformFromField(value?: Color): string | undefined {
    if (!value) {
      return undefined;
    }
    return stringifyHEX(value);
  }

  protected override transformFromForm(value?: string): Color | undefined {
    if (!value) {
      return ColorFieldComponent.defaultColor;
    }
    const isRGBA: boolean = value.startsWith('rgba(') || value.startsWith('rgb(');

    if (isRGBA) {
      return parseRGBA(value);
    }
    return parseHEX(value);
  }

  protected override onFieldChanged(value: Color | undefined) {
    super.onFieldChanged(value);
    if (!this.$panel) {
      return;
    }
    if (!value) {
      this.$panel.color = '';
      return;
    }
    this.$panel.color = stringifyRGBA(value);
  }

  protected onColorPickerOpened(): void {
    if (!this.$panel) {
      return;
    }
    this.$panel.menu = 3;
    if (this.$panel.color.length === 0 && this.field.value) {
      this.$panel.color = stringifyRGBA(this.field.value);
    }
  }

}
