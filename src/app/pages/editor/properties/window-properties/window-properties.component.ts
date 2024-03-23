import {Component, DestroyRef} from '@angular/core';
import {FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: 'fig-window-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './window-properties.component.html',
  styleUrl: './window-properties.component.css'
})
export class WindowPropertiesComponent extends AbstractPropertiesComponent<FIGWindowWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    width: new FormControl<number>(32, {validators: [Validators.min(32)]}),
    height: new FormControl<number>(32, {validators: [Validators.min(32)]})
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('width', this.widget.size.width);
    this.setProperty('height', this.widget.size.height);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onWidthChanged(value: number): void {
    if (!this.form.get('width')!.valid) {
      return;
    }
    this.widget.size.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.form.get('height')!.valid) {
      return;
    }
    this.widget.size.height = value;
    this.update.emit();
  }

}
