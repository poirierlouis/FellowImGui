import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGRadioWidget} from "../../../../models/widgets/radio.widget";

@Component({
  selector: 'fig-radio-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './radio-properties.component.html',
  styleUrl: './radio-properties.component.css'
})
export class RadioPropertiesComponent extends AbstractPropertiesComponent<FIGRadioWidget> {

  override form: FormGroup = new FormGroup<any>({
    groupId: new FormControl<string>(''),
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    index: new FormControl<number>(0, {validators: Validators.min(0)}),
    isSelected: new FormControl<boolean>({value: false, disabled: true}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('groupId', 300).subscribe(this.onGroupIDChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('index', 200).subscribe(this.onIndexChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('groupId', this.widget.groupId);
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('index', this.widget.index);
    this.setProperty('isSelected', this.widget.value == this.widget.index);
  }

  private onGroupIDChanged(value: string): void {
    this.widget.groupId = value;
    this.update.emit();
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

  private onIndexChanged(value: number): void {
    this.widget.index = value;
    this.update.emit();
  }

}
