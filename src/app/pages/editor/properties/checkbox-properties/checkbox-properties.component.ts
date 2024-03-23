import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGCheckboxWidget} from "../../../../models/widgets/checkbox.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-checkbox-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-properties.component.html',
  styleUrl: './checkbox-properties.component.css'
})
export class CheckboxPropertiesComponent extends AbstractPropertiesComponent<FIGCheckboxWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    isChecked: new FormControl<boolean>(false),
    tooltip: new FormControl<string | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('isChecked').subscribe(this.onIsCheckedChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('isChecked', this.widget.isChecked);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIsCheckedChanged(value: boolean): void {
    this.widget.isChecked = value;
    this.update.emit();
  }

}
