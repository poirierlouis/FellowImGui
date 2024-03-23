import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGLabelWidget} from "../../../../models/widgets/label.widget";

@Component({
  selector: 'fig-label-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './label-properties.component.html',
  styleUrl: './label-properties.component.css'
})
export class LabelPropertiesComponent extends AbstractPropertiesComponent<FIGLabelWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    value: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('value').subscribe(this.onValueChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('value', this.widget.value);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onValueChanged(value: string): void {
    this.widget.value = value;
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
