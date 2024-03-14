import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGInputTextWidget} from "../../../../models/widgets/input-text.widget";

@Component({
  selector: 'fig-input-text-properties',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './input-text-properties.component.html',
  styleUrl: './input-text-properties.component.css'
})
export class InputTextPropertiesComponent extends AbstractPropertiesComponent<FIGInputTextWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    hint: new FormControl<string | null>(null),
    value: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    bufferSize: new FormControl<number>(256, {validators: Validators.min(0)}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('hint').subscribe(this.onHintChanged.bind(this));
    this.listenProperty('value').subscribe(this.onValueChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('bufferSize').subscribe(this.onBufferSizeChanged.bind(this));
  }

  protected override updateForm() {
    if (!this.widget) {
      return;
    }
    this.setProperty('text', this.widget.text);
    this.setProperty('hint', this.widget.hint ?? null);
    this.setProperty('value', this.widget.value);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('bufferSize', this.widget.bufferSize);
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onHintChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.hint = value ?? undefined;
    this.update.emit();
  }

  private onValueChanged(value: string): void {
    this.widget!.value = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onBufferSizeChanged(value: number): void {
    this.widget!.bufferSize = value;
    this.update.emit();
  }

}
