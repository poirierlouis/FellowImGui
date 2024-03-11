import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: 'fig-window-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './window-properties.component.html',
  styleUrl: './window-properties.component.css'
})
export class WindowPropertiesComponent extends AbstractPropertiesComponent<FIGWindowWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    title: new FormControl<string>(''),
    width: new FormControl<number>(32, {validators: [Validators.min(32)]}),
    height: new FormControl<number>(32, {validators: [Validators.min(32)]})
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('title').subscribe(this.onTitleChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.dispose();
    this.widget = value as FIGWindowWidget;
    this.load();
  }

  protected override updateForm(): void {
    if (!this.widget) {
      return;
    }
    this.form.get('title')!.setValue(this.widget.title, {emitEvent: false});
    this.form.get('width')!.setValue(this.widget.size.width, {emitEvent: false});
    this.form.get('height')!.setValue(this.widget.size.height, {emitEvent: false});
  }

  private onTitleChanged(value: string): void {
    this.widget!.title = value;
    this.update.emit();
  }

  private onWidthChanged(value: number): void {
    if (!this.form.get('width')!.valid) {
      return;
    }
    this.widget!.size.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.form.get('height')!.valid) {
      return;
    }
    this.widget!.size.height = value;
    this.update.emit();
  }

}
