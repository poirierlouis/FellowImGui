import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGTableFlags, FIGTableWidget} from "../../../../models/widgets/table.widget";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-table-properties',
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
  templateUrl: './table-properties.component.html',
  styleUrl: './table-properties.component.css'
})
export class TablePropertiesComponent extends AbstractPropertiesComponent<FIGTableWidget> {

  readonly flags: FlagItem<FIGTableFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>('##'),
    columns: new FormControl<number>(2, {validators: Validators.min(1)}),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGTableWidget.flags) {
      this.flags.push({
        label: FIGTableFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('columns').subscribe(this.onColumnChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label.slice(2));
    this.setProperty('columns', this.widget.columns);
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

  private onColumnChanged(value: number): void {
    if (!this.testProperty('columns')) {
      this.setProperty('columns', this.widget.columns);
      return;
    }
    this.widget.columns = value;
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
