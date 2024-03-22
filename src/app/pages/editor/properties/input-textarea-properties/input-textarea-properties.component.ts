import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FIGInputTextFlags, FIGInputTextWidget} from "../../../../models/widgets/input-text.widget";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGInputTextareaWidget} from "../../../../models/widgets/input-textarea.widget";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

interface FlagItem {
  readonly label: string;
  readonly value: FIGInputTextFlags;
}

@Component({
  selector: 'fig-input-textarea-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatPrefix,
    MatFormField,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './input-textarea-properties.component.html',
  styleUrl: './input-textarea-properties.component.css'
})
export class InputTextareaPropertiesComponent extends AbstractPropertiesComponent<FIGInputTextareaWidget> {

  readonly flags: FlagItem[] = [];

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>('##'),
    value: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    linesSize: new FormControl<number>(4, {validators: Validators.min(1)}),
    bufferSize: new FormControl<number>(256, {validators: Validators.min(0)}),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGInputTextWidget.flags) {
      this.flags.push({
        label: FIGInputTextFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('value').subscribe(this.onValueChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('linesSize').subscribe(this.onLinesSizeChanged.bind(this));
    this.listenProperty('bufferSize').subscribe(this.onBufferSizeChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm() {
    if (!this.widget) {
      return;
    }
    this.setProperty('label', this.widget.label.slice(2));
    this.setProperty('value', this.widget.value);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('linesSize', this.widget.linesSize);
    this.setProperty('bufferSize', this.widget.bufferSize);
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
    this.widget!.label = `##${value}`;
    this.update.emit();
  }

  private onValueChanged(value: string): void {
    if (value.length > this.widget!.bufferSize) {
      this.widget!.bufferSize = value.length;
      this.setProperty('bufferSize', value.length);
    }
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
    if (value < this.widget!.value.length) {
      this.widget!.value = this.widget!.value.substring(0, value);
      this.setProperty('value', this.widget!.value);
    }
    this.widget!.bufferSize = value;
    this.update.emit();
  }

  private onLinesSizeChanged(value: number): void {
    if (!this.testProperty('linesSize')) {
      this.setProperty('linesSize', this.widget!.linesSize);
      return;
    }
    this.widget!.linesSize = value;
    this.update.emit();
  }

  private onFlagsChanged(value: number[]): void {
    for (const flag of this.flags) {
      const isEnabled: boolean = value.includes(flag.value);

      if (isEnabled) {
        this.widget!.flags |= flag.value;
      } else if ((this.widget!.flags & flag.value) === flag.value) {
        this.widget!.flags ^= flag.value;
      }
    }
    this.update.emit();
  }

}
