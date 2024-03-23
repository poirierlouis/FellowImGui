import {Component, DestroyRef, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgxColorsModule, NgxColorsTriggerDirective} from "ngx-colors";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {PanelComponent} from "ngx-colors/lib/components/panel/panel.component";
import {Color, parseRGBA, stringifyHEX, stringifyRGBA} from "../../../../models/math";
import {FIGInputColorEditWidget} from "../../../../models/widgets/input-color-edit.widget";

@Component({
  selector: 'fig-input-color-edit-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    NgxColorsModule,
    ReactiveFormsModule
  ],
  templateUrl: './input-color-edit-properties.component.html',
  styleUrl: './input-color-edit-properties.component.css'
})
export class InputColorEditPropertiesComponent extends AbstractPropertiesComponent<FIGInputColorEditWidget> {

  @ViewChild(NgxColorsTriggerDirective)
  ngxColor!: NgxColorsTriggerDirective;

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    color: new FormControl<string>(''),
    withAlpha: new FormControl<boolean>(false),
    tooltip: new FormControl<string | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('color').subscribe(this.onColorChanged.bind(this));
    this.listenProperty('withAlpha').subscribe(this.onWithAlphaChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected onColorPickerOpened(): void {
    const $panel: PanelComponent = this.ngxColor.panelRef.instance;

    $panel.menu = 3;
    if ($panel.color.length === 0) {
      $panel.color = stringifyRGBA(this.widget.color);
    } else if ($panel.color.length === 0) {
      $panel.color = 'rgb(255, 255, 255)';
    }
  }

  protected override updateForm(): void {
    const color: Color = {...this.widget.color};

    if (!this.widget.withAlpha) {
      color.a = 1.0;
    }
    this.setProperty('label', this.widget.label);
    this.setProperty('color', stringifyHEX(color));
    this.setProperty('withAlpha', this.widget.withAlpha);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onColorChanged(value: string): void {
    const alpha: number = this.widget.withAlpha ? 0.5 : 1.0;

    this.widget.color = parseRGBA(value) ?? {r: 0.5, g: 0.5, b: 0.5, a: alpha};
    this.update.emit();
  }

  private onWithAlphaChanged(value: boolean): void {
    this.widget.withAlpha = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

}
