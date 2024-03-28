import {Component, DestroyRef, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGTextWidget} from "../../../../models/widgets/text.widget";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgxColorsModule, NgxColorsTriggerDirective} from "ngx-colors";
import {parseRGBA, stringifyHEX, stringifyRGBA} from "../../../../models/math";
import {PanelComponent} from "ngx-colors/lib/components/panel/panel.component";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'fig-text-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    NgxColorsModule,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './text-properties.component.html',
  styleUrl: './text-properties.component.css'
})
export class TextPropertiesComponent extends AbstractPropertiesComponent<FIGTextWidget> {

  @ViewChild(NgxColorsTriggerDirective)
  ngxColor!: NgxColorsTriggerDirective;

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    color: new FormControl<string>(''),
    isDisabled: new FormControl<boolean>(false),
    isWrapped: new FormControl<boolean>(false),
    hasBullet: new FormControl<boolean>(false),
    align: new FormControl<boolean>(false),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('color').subscribe(this.onColorChanged.bind(this));
    this.listenProperty('isDisabled').subscribe(this.onIsDisabledChanged.bind(this));
    this.listenProperty('isWrapped').subscribe(this.onIsWrappedChanged.bind(this));
    this.listenProperty('hasBullet').subscribe(this.onHasBulletChanged.bind(this));
    this.listenProperty('align').subscribe(this.onAlignChanged.bind(this));
  }

  protected onColorPickerOpened(): void {
    const $panel: PanelComponent = this.ngxColor.panelRef.instance;

    $panel.menu = 3;
    if ($panel.color.length === 0 && this.widget.color) {
      $panel.color = stringifyRGBA(this.widget.color);
    } else if ($panel.color.length === 0) {
      $panel.color = 'rgb(255, 255, 255)';
    }
  }

  protected override updateForm(): void {
    this.setProperty('text', this.widget.text);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('color', this.widget.color ? stringifyHEX(this.widget.color) : '');
    this.setProperty('isDisabled', this.widget.isDisabled);
    this.setProperty('isWrapped', this.widget.isWrapped);
    this.setProperty('hasBullet', this.widget.hasBullet);
    this.setProperty('align', this.widget.align);
  }

  private onTextChanged(value: string): void {
    this.widget.text = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onColorChanged(value: string): void {
    this.widget.color = parseRGBA(value);
    this.update.emit();
  }

  private onIsDisabledChanged(value: boolean): void {
    this.widget.isDisabled = value;
    this.update.emit();
  }

  private onIsWrappedChanged(value: boolean): void {
    this.widget.isWrapped = value;
    this.update.emit();
  }

  private onHasBulletChanged(value: boolean): void {
    this.widget.hasBullet = value;
    this.update.emit();
  }

  private onAlignChanged(value: boolean): void {
    this.widget.align = value;
    this.update.emit();
  }

}
