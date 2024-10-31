import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGInputNumberType, FIGInputNumberWidget} from "../../../../models/widgets/input-number.widget";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-input-number-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatDivider,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './input-number-properties.component.html',
  styleUrl: './input-number-properties.component.css'
})
export class InputNumberPropertiesComponent extends AbstractPropertiesComponent<FIGInputNumberWidget> {

  override form: FormGroup = new FormGroup<any>({
    dataType: new FormControl<FIGInputNumberType>(FIGInputNumberType.int),
    value0: new FormControl<number>(0, {nonNullable: true}),
    value1: new FormControl<number>(0, {nonNullable: true}),
    value2: new FormControl<number>(0, {nonNullable: true}),
    value3: new FormControl<number>(0, {nonNullable: true}),
    step: new FormControl<number>(1, {nonNullable: true}),
    stepFast: new FormControl<number>(10, {nonNullable: true}),
    precision: new FormControl<number>(2, {nonNullable: true}),
    format: new FormControl<string>({value: "%.2f", disabled: true}),
    useScientificNotation: new FormControl<boolean>(false),
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
  });

  step: number = 1;

  protected readonly FIGInputNumberType = FIGInputNumberType;
  protected readonly isInteger = FIGInputNumberWidget.isInteger;
  protected readonly getArraySize = FIGInputNumberWidget.getArraySize;

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('dataType').subscribe(this.onDataTypeChanged.bind(this));
    this.listenProperty('value0', 300).subscribe((value) => this.onValueChanged(value, 0));
    this.listenProperty('value1', 300).subscribe((value) => this.onValueChanged(value, 1));
    this.listenProperty('value2', 300).subscribe((value) => this.onValueChanged(value, 2));
    this.listenProperty('value3', 300).subscribe((value) => this.onValueChanged(value, 3));
    this.listenProperty('step').subscribe(this.onStepChanged.bind(this));
    this.listenProperty('stepFast').subscribe(this.onStepFastChanged.bind(this));
    this.listenProperty('precision').subscribe(this.onPrecisionChanged.bind(this));
    this.listenProperty('useScientificNotation').subscribe(this.onScientificNotationChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('dataType', this.widget.dataType);
    const size: number = FIGInputNumberWidget.getArraySize(this.widget.dataType);
    const values: number[] = this.widget.value;

    this.setProperty('value0', this.formatNumber(values[0]));
    if (size > 1) {
      this.setProperty('value2', this.formatNumber(values[1]));
    }
    if (size > 2) {
      this.setProperty('value2', this.formatNumber(values[2]));
    }
    if (size > 3) {
      this.setProperty('value3', this.formatNumber(values[3]));
    }
    this.setProperty('step', this.widget.step);
    this.setProperty('stepFast', this.widget.stepFast);
    if (!this.isInteger(this.widget.dataType)) {
      const precision: number | undefined = FIGInputNumberWidget.getPrecision(this.widget);

      if (precision !== undefined) {
        this.setProperty('precision', precision);
      }
    }
    this.setProperty('format', this.widget.format);
    this.setProperty('useScientificNotation', this.widget.format === '%e');
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
  }

  private onDataTypeChanged(dataType: FIGInputNumberType): void {
    const prevValue: number[] = this.widget.value;
    const prevSize: number = this.getArraySize(this.widget.dataType);
    const size: number = this.getArraySize(dataType);

    this.widget.dataType = dataType;
    if (size === 1) {
      this.widget.value[0] = prevValue[0];
      this.setProperty('value0', this.formatNumber(this.widget.value[0]));
    } else if (size > 1) {
      const values: number[] = prevValue;

      for (let i = 0; i < size - 1; i++) {
        values.push(0);
      }
      this.widget.value = values;
      for (let i = 0; i < size; i++) {
        this.setProperty(`value${i}`, this.formatNumber(values[i]));
      }
    } else if (prevSize < size) {
      const values: number[] = this.widget.value;

      for (let i = prevSize; i < size; i++) {
        values.push(0);
        this.setProperty(`value${i}`, this.formatNumber(values[i]));
      }
    } else if (prevSize > size) {
      const values: number[] = this.widget.value;
      const delta: number = prevSize - size;
      const index: number = prevSize - delta;

      values.splice(index, delta);
    }
    this.update.emit();
  }

  private onValueChanged(value: string, index: number): void {
    const isArray: boolean = FIGInputNumberWidget.isArray(this.widget.dataType);
    const prevValue: number = (isArray) ? this.widget.value[index] : this.widget.value[0];
    const number: number = +value;

    if (FIGInputNumberWidget.isInteger(this.widget.dataType) && !Number.isInteger(number)) {
      this.setProperty(`value${index}`, this.formatNumber(prevValue));
      return;
    }
    if (isArray) {
      this.widget.value[index] = number;
    } else {
      this.widget.value[0] = number;
    }
    this.update.emit();
  }

  private onStepChanged(value: number): void {
    this.widget.step = value;
    this.update.emit();
  }

  private onStepFastChanged(value: number): void {
    this.widget.stepFast = value;
    this.update.emit();
  }

  private onPrecisionChanged(precision: string): void {
    const format: string = `%.${precision}f`;

    this.widget.format = format;
    this.setProperty('format', format);
    this.update.emit();
  }

  private onScientificNotationChanged(value: boolean): void {
    if (value) {
      this.widget.format = '%e';
      this.setProperty('format', '%e');
      this.disableProperty('precision');
      this.disableProperty('format');
    } else {
      this.enableProperty('format');
      this.enableProperty('precision');
      this.onPrecisionChanged(this.getProperty('precision'));
      return;
    }
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
