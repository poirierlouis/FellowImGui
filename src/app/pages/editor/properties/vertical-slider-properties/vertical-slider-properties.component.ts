import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGVerticalSliderType, FIGVerticalSliderWidget} from "../../../../models/widgets/vertical-slider.widget";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";
import {NumberFieldComponent} from "../../fields/number-field/number-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";

@Component({
    selector: 'fig-vertical-slider-properties',
    imports: [
        MatInput,
        MatLabel,
        MatFormField,
        ReactiveFormsModule,
        EnumFieldComponent,
        NumberFieldComponent,
        StringFieldComponent,
        BoolFieldComponent,
        SizeFieldComponent
    ],
    templateUrl: './vertical-slider-properties.component.html',
    styleUrl: './vertical-slider-properties.component.css'
})
export class VerticalSliderPropertiesComponent extends AbstractPropertiesComponent<FIGVerticalSliderWidget> {

  step: number = 1;
  readonly precision: FormControl<number> = new FormControl<number>(2, {nonNullable: true});

  protected readonly isInteger = FIGVerticalSliderWidget.isInteger;

  constructor(dr: DestroyRef) {
    super(dr);
    this.precision.valueChanges.pipe(takeUntilDestroyed(dr)).subscribe(this.onPrecisionChanged.bind(this));
  }

  protected override load(): void {
    super.load();

    if (FIGVerticalSliderWidget.isFloat(this.widget.dataType)) {
      const precision: number | undefined = FIGVerticalSliderWidget.getPrecision(this.widget);
      if (precision !== undefined) {
        this.precision.setValue(precision, {emitEvent: false});
        this.onPrecisionChanged(precision);
      }
    }
  }

  private onPrecisionChanged(precision: number): void {
    this.updateStep(this.widget.dataType);
    this.updateValues(this.widget.dataType);
    this.widget.format = `%.${precision}f`;
  }

  private onDataTypeChanged(dataType: FIGVerticalSliderType): void {
    this.updateStep(dataType);
    this.updateValues(dataType);
    if (this.isInteger(dataType)) {
      this.widget.format = '%d';
    } else {
      if (this.precision.value === 0) {
        this.precision.setValue(2, {emitEvent: false});
      }
      this.widget.format = `%.${this.precision.value}f`;
    }
  }

  private onValueMinChanged(value: number): void {
    if (this.widget.value < value) {
      this.widget.value = value;
    }
  }

  private onValueMaxChanged(value: number): void {
    if (this.widget.value > value) {
      this.widget.value = value;
    }
  }

  private updateStep(dataType: FIGVerticalSliderType): void {
    if (this.isInteger(dataType)) {
      this.step = 1;
    } else {
      const round: number = Math.pow(10, this.precision.value);

      this.step = 1 / round;
    }
  }

  private updateValues(dataType: FIGVerticalSliderType): void {
    const round: number = Math.pow(10, this.precision.value);

    if (this.isInteger(dataType)) {
      this.widget.value = Math.trunc(this.widget.value);
    } else {
      this.widget.value = Math.round(this.widget.value * round) / round;
    }
  }
}
