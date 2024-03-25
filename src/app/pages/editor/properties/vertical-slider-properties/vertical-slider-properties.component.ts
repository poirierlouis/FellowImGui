import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGVerticalSliderType, FIGVerticalSliderWidget} from "../../../../models/widgets/vertical-slider.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {getPrecision} from "../../../../models/string";

@Component({
  selector: 'fig-vertical-slider-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatPrefix,
    MatSelect,
    MatOption,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './vertical-slider-properties.component.html',
  styleUrl: './vertical-slider-properties.component.css'
})
export class VerticalSliderPropertiesComponent extends AbstractPropertiesComponent<FIGVerticalSliderWidget> {

  override form: FormGroup = new FormGroup<any>({
    dataType: new FormControl<FIGVerticalSliderType>(FIGVerticalSliderType.int),
    label: new FormControl<string>(''),
    width: new FormControl<number | null>(null),
    height: new FormControl<number | null>(null),
    value: new FormControl<number | null>(null),
    valueMin: new FormControl<number | null>(null),
    valueMax: new FormControl<number | null>(null),
    format: new FormControl<string | null>(null),
    power: new FormControl<number | null>(null),
    tooltip: new FormControl<boolean>(false),
  });

  protected readonly FIGVerticalSliderType = FIGVerticalSliderType;

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('dataType').subscribe(this.onDataTypeChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('value', 300).subscribe(this.onValueChanged.bind(this));
    this.listenProperty('valueMin', 300).subscribe(this.onValueMinChanged.bind(this));
    this.listenProperty('valueMax', 300).subscribe(this.onValueMaxChanged.bind(this));
    this.listenProperty('format').subscribe(this.onFormatChanged.bind(this));
    this.listenProperty('power').subscribe(this.onPowerChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('dataType', this.widget.dataType);
    this.setProperty('label', this.widget.label.slice(2));
    this.setProperty('width', this.widget.size.width);
    this.setProperty('height', this.widget.size.height);
    this.setProperty('value', this.formatNumber(this.widget.value));
    this.setProperty('valueMin', this.widget.valueMin);
    this.setProperty('valueMax', this.widget.valueMax);
    this.setProperty('format', this.widget.format);
    this.setProperty('power', this.widget.power);
    this.setProperty('tooltip', this.widget.tooltip);
  }

  private onDataTypeChanged(value: FIGVerticalSliderType): void {
    const prevValue: FIGVerticalSliderType = this.widget.dataType;

    this.widget.dataType = value;
    if (prevValue !== value) {
      const isInteger: boolean = value === FIGVerticalSliderType.int;

      this.widget.format = isInteger ? '%d' : '%.3f';
      this.widget.valueMin = isInteger ? 0 : 0.0;
      this.widget.valueMax = isInteger ? 5 : 1.0;
      this.setProperty('format', this.widget.format);
      this.setProperty('valueMin', this.widget.valueMin);
      this.setProperty('valueMax', this.widget.valueMax);
    }
    this.update.emit();
  }

  private onLabelChanged(value: string): void {
    if (value.startsWith('##')) {
      value = value.slice(2);
    }
    this.widget.label = `##${value}`;
    this.update.emit();
  }

  private onWidthChanged(value: number | null): void {
    if (!this.testProperty('width')) {
      this.setProperty('width', this.widget.size.width);
      return;
    }
    this.widget.size.width = value!;
    this.update.emit();
  }

  private onHeightChanged(value: number | null): void {
    if (!this.testProperty('height')) {
      this.setProperty('height', this.widget.size.height);
      return;
    }
    this.widget.size.height = value!;
    this.update.emit();
  }

  private onValueChanged(value: number | null): void {
    if (!this.testProperty('value')) {
      this.setProperty('value', this.formatNumber(this.widget.value));
      return;
    }
    this.widget.value = value!;
    this.update.emit();
  }

  private onValueMinChanged(value: number | null): void {
    value ??= 0;
    this.widget.valueMin = value;
    if (this.widget.value < value) {
      this.setProperty('value', value);
      this.widget.value = value;
    }
    this.update.emit();
  }

  private onValueMaxChanged(value: number | null): void {
    value ??= 100;
    this.widget.valueMax = value;
    if (this.widget.value > value) {
      this.setProperty('value', value);
      this.widget.value = value;
    }
    this.update.emit();
  }

  private onFormatChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.format = value ?? '';
    this.update.emit();
  }

  private onPowerChanged(value: number | null): void {
    if (!this.testProperty('power')) {
      this.setProperty('power', this.widget.power);
      return;
    }
    this.widget.power = value ?? 0;
    this.update.emit();
  }

  private onTooltipChanged(value: boolean): void {
    this.widget.tooltip = value;
    this.update.emit();
  }

  private formatNumber(value: number): string {
    const format: string = this.widget.format;
    const precision: number | undefined = getPrecision(format);

    if (precision === undefined) {
      return value.toString();
    }
    return value.toFixed(precision);
  }

}
