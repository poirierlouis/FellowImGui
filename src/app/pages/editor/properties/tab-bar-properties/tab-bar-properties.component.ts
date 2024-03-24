import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGTabBarFlags, FIGTabBarWidget} from "../../../../models/widgets/tab-bar.widget";

@Component({
  selector: 'fig-tab-bar-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatPrefix,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './tab-bar-properties.component.html',
  styleUrl: './tab-bar-properties.component.css'
})
export class TabBarPropertiesComponent extends AbstractPropertiesComponent<FIGTabBarWidget> {

  readonly flags: FlagItem<FIGTabBarFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>('##'),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGTabBarWidget.flags) {
      this.flags.push({
        label: FIGTabBarFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label.slice(2));
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
  }

  private onLabelChanged(value: string): void {
    value = value.trim();
    if (value.startsWith('##')) {
      value = value.slice(2);
    }
    this.widget.label = `##${value}`;
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
