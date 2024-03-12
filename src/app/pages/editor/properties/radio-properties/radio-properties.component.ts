import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGRadioWidget} from "../../../../models/widgets/radio.widget";

@Component({
  selector: 'fig-radio-properties',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './radio-properties.component.html',
  styleUrl: './radio-properties.component.css'
})
export class RadioPropertiesComponent extends AbstractPropertiesComponent<FIGRadioWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    groupId: new FormControl<string>(''),
    text: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    index: new FormControl<number>(0, {validators: Validators.min(0)}),
    isSelected: new FormControl<boolean>({value: false, disabled: true}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('groupId').subscribe(this.onGroupIDChanged.bind(this));
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('index').subscribe(this.onIndexChanged.bind(this));
  }

  protected override updateForm(): void {
    if (!this.widget) {
      return;
    }
    this.form.get('groupId')!.setValue(this.widget.groupId, {emitEvent: false});
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
    this.form.get('tooltip')!.setValue(this.widget.tooltip ?? null, {emitEvent: false});
    this.form.get('index')!.setValue(this.widget.index, {emitEvent: false});
    this.form.get('isSelected')!.setValue(this.widget.value == this.widget.index, {emitEvent: false});
  }

  private onGroupIDChanged(value: string): void {
    this.widget!.groupId = value;
    this.update.emit();
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIndexChanged(value: number): void {
    this.widget!.index = value;
    this.update.emit();
  }

}
