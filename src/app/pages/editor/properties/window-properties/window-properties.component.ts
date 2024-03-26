import {Component, DestroyRef} from '@angular/core';
import {FIGWindowFlags, FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-window-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './window-properties.component.html',
  styleUrl: './window-properties.component.css'
})
export class WindowPropertiesComponent extends AbstractPropertiesComponent<FIGWindowWidget> {

  readonly flags: FlagItem<FIGWindowFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    width: new FormControl<number>(32, {validators: [Validators.min(32)]}),
    height: new FormControl<number>(32, {validators: [Validators.min(32)]}),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGWindowWidget.flags) {
      this.flags.push({
        label: FIGWindowFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('width', this.widget.size.width);
    this.setProperty('height', this.widget.size.height);
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
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

  private onFlagsChanged(value: number[]): void {
    for (const flag of this.flags) {
      const isEnabled: boolean = value.includes(flag.value);

      if (isEnabled) {
        this.widget.flags |= flag.value;
      } else if ((this.widget.flags & flag.value) === flag.value) {
        this.widget.flags ^= flag.value;
      }
    }
    this.update.emit();
  }

}
