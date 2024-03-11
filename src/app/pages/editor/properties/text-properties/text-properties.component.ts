import {Component, DestroyRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGTextWidget} from "../../../../models/widgets/text.widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgxColorsModule, NgxColorsTriggerDirective} from "ngx-colors";
import {parseRGBA, stringifyRGBA} from "../../../../models/math";
import {PanelComponent} from "ngx-colors/lib/components/panel/panel.component";

@Component({
  selector: 'fig-text-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    NgxColorsModule,
    ReactiveFormsModule
  ],
  templateUrl: './text-properties.component.html',
  styleUrl: './text-properties.component.css'
})
export class TextPropertiesComponent extends AbstractPropertiesComponent<FIGTextWidget> {

  @ViewChild(NgxColorsTriggerDirective)
  ngxColor!: NgxColorsTriggerDirective;

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    color: new FormControl<string>(''),
    isDisabled: new FormControl<boolean>(false),
    hasBullet: new FormControl<boolean>(false),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('color').subscribe(this.onColorChanged.bind(this));
    this.listenProperty('isDisabled').subscribe(this.onIsDisabledChanged.bind(this));
    this.listenProperty('hasBullet').subscribe(this.onHasBulletChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.dispose();
    this.widget = value as FIGTextWidget;
    this.load();
  }

  protected onColorPickerOpened(): void {
    const $panel: PanelComponent = this.ngxColor.panelRef.instance;

    $panel.menu = 3;
    if ($panel.color.length === 0 && this.widget!.color) {
      $panel.color = stringifyRGBA(this.widget!.color);
    } else if ($panel.color.length === 0) {
      $panel.color = 'rgb(255, 255, 255)';
    }
  }

  protected override updateForm(): void {
    if (!this.widget) {
      return;
    }
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
    if (this.widget.color) {
      this.form.get('color')!.setValue(stringifyRGBA(this.widget.color), {emitEvent: false});
    }
    this.form.get('isDisabled')!.setValue(this.widget.isDisabled, {emitEvent: false});
    this.form.get('hasBullet')!.setValue(this.widget.hasBullet, {emitEvent: false});
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onColorChanged(value: string): void {
    this.widget!.color = parseRGBA(value);
    this.update.emit();
  }

  private onIsDisabledChanged(value: boolean): void {
    this.widget!.isDisabled = value;
    this.update.emit();
  }

  private onHasBulletChanged(value: boolean): void {
    this.widget!.hasBullet = value;
    this.update.emit();
  }

}
