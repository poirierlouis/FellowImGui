import {Component, DestroyRef} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGSliderDataType, FIGSliderType, FIGSliderWidget} from "../../../../models/widgets/slider.widget";

@Component({
  selector: 'fig-slider-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatDivider,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './slider-properties.component.html',
  styleUrl: './slider-properties.component.css'
})
export class SliderPropertiesComponent extends AbstractPropertiesComponent<FIGSliderWidget> {

  override form: FormGroup = new FormGroup<any>({
    sliderType: new FormControl<FIGSliderType>(FIGSliderType.slider),
    dataType: new FormControl<FIGSliderDataType>(FIGSliderDataType.int),
    value0: new FormControl<number>(0, {nonNullable: true}),
    value1: new FormControl<number>(0, {nonNullable: true}),
    value2: new FormControl<number>(0, {nonNullable: true}),
    value3: new FormControl<number>(0, {nonNullable: true}),
    valueSpeed: new FormControl<number>(0.01, {nonNullable: true}),
    valueMin: new FormControl<number>(1, {nonNullable: true}),
    valueMax: new FormControl<number>(10, {nonNullable: true}),
    precision: new FormControl<number>(2, {nonNullable: true}),
    format: new FormControl<string>({value: "%.2f", disabled: true}),
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
  });

  step: number = 1;

  protected readonly FIGSliderType = FIGSliderType;
  protected readonly FIGSliderDataType = FIGSliderDataType;
  protected readonly isInteger = FIGSliderWidget.isInteger;
  protected readonly getArraySize = FIGSliderWidget.getArraySize;

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('sliderType').subscribe(this.onSliderTypeChanged.bind(this));
    this.listenProperty('dataType').subscribe(this.onDataTypeChanged.bind(this));
    this.listenProperty('value0', 300).subscribe((value) => this.onValueChanged(value, 0));
    this.listenProperty('value1', 300).subscribe((value) => this.onValueChanged(value, 1));
    this.listenProperty('value2', 300).subscribe((value) => this.onValueChanged(value, 2));
    this.listenProperty('value3', 300).subscribe((value) => this.onValueChanged(value, 3));
    this.listenProperty('valueSpeed').subscribe(this.onValueSpeedChanged.bind(this));
    this.listenProperty('valueMin').subscribe(this.onValueMinChanged.bind(this));
    this.listenProperty('valueMax').subscribe(this.onValueMaxChanged.bind(this));
    this.listenProperty('precision').subscribe(this.onPrecisionChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('sliderType', this.widget.sliderType);
    this.setProperty('dataType', this.widget.dataType);
    const size: number = FIGSliderWidget.getArraySize(this.widget.dataType);

    if (size > 0) {
      const values: number[] = this.widget.value as number[];

      this.setProperty('value0', this.formatNumber(values[0]));
      this.setProperty('value1', this.formatNumber(values[1]));
      if (size > 2) {
        this.setProperty('value2', this.formatNumber(values[2]));
      }
      if (size > 3) {
        this.setProperty('value3', this.formatNumber(values[3]));
      }
    } else {
      this.setProperty('value0', this.formatNumber(this.widget.value as number));
    }
    this.setProperty('valueSpeed', this.widget.valueSpeed);
    this.setProperty('valueMin', this.widget.valueMin);
    this.setProperty('valueMax', this.widget.valueMax);
    if (!this.isInteger(this.widget.dataType)) {
      const precision: number | undefined = FIGSliderWidget.getPrecision(this.widget);

      if (precision !== undefined) {
        this.setProperty('precision', precision);
      }
    }
    this.setProperty('format', this.widget.format);
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
  }

  private onSliderTypeChanged(value: FIGSliderType): void {
    this.widget.sliderType = value;
    this.update.emit();
  }

  private onDataTypeChanged(dataType: FIGSliderDataType): void {
    const prevValue: number | number[] = this.widget.value;
    const prevSize: number = this.getArraySize(this.widget.dataType);
    const size: number = this.getArraySize(dataType);

    this.widget.dataType = dataType;
    if (size === 0 && prevValue instanceof Array) {
      this.widget.value = prevValue[0];
      this.setProperty('value0', this.formatNumber(this.widget.value));
    } else if (size > 0 && !(prevValue instanceof Array)) {
      const values: number[] = [prevValue];

      for (let i = 0; i < size - 1; i++) {
        values.push(0);
      }
      this.widget.value = values;
      for (let i = 0; i < size; i++) {
        this.setProperty(`value${i}`, this.formatNumber(values[i]));
      }
    } else if (prevSize < size) {
      const values: number[] = this.widget.value as number[];

      for (let i = prevSize; i < size; i++) {
        values.push(0);
        this.setProperty(`value${i}`, this.formatNumber(values[i]));
      }
    } else if (prevSize > size) {
      const values: number[] = this.widget.value as number[];
      const delta: number = prevSize - size;
      const index: number = prevSize - delta;

      values.splice(index, delta);
    }
    this.update.emit();
  }

  private onValueChanged(value: string, index: number): void {
    const isArray: boolean = FIGSliderWidget.isArray(this.widget.dataType);
    const prevValue: number = (isArray) ? (this.widget.value as number[])[index] : this.widget.value as number;
    const number: number = +value;

    if (FIGSliderWidget.isInteger(this.widget.dataType) && !Number.isInteger(number)) {
      this.setProperty(`value${index}`, this.formatNumber(prevValue));
      return;
    }
    if (isArray) {
      (this.widget.value as number[])[index] = number;
    } else {
      this.widget.value = number;
    }
    this.update.emit();
  }

  private onValueSpeedChanged(value: number): void {
    this.widget.valueSpeed = value;
    this.update.emit();
  }

  private onValueMinChanged(value: number): void {
    this.widget.valueMin = value;
    this.update.emit();
  }

  private onValueMaxChanged(value: number): void {
    this.widget.valueMax = value;
    this.update.emit();
  }

  private onPrecisionChanged(precision: string): void {
    const format: string = `%.${precision}f`;

    this.widget.format = format;
    this.setProperty('format', format);
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

  private formatNumber(value: number): string {
    if (this.isInteger(this.widget.dataType)) {
      return value.toString();
    }
    return value.toFixed(+this.getProperty<string>('precision'));
  }

}
