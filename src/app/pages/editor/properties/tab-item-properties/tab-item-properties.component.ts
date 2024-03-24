import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGTabItemFlags, FIGTabItemWidget} from "../../../../models/widgets/tab-item.widget";

@Component({
  selector: 'fig-tab-item-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './tab-item-properties.component.html',
  styleUrl: './tab-item-properties.component.css'
})
export class TabItemPropertiesComponent extends AbstractPropertiesComponent<FIGTabItemWidget> {

  readonly flags: FlagItem<FIGTabItemFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>('', {validators: Validators.min(1)}),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGTabItemWidget.flags) {
      this.flags.push({
        label: FIGTabItemFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label);
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
  }

  private onLabelChanged(value: string): void {
    if (!this.testProperty('label')) {
      this.setProperty('label', this.widget.label);
      return;
    }
    this.widget.label = value;
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
