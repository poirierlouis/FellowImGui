import {Component} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {type FIGSliderDataType, FIGSliderType, FIGSliderWidget} from "../../../../models/widgets/slider.widget";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";
import {NumberFieldComponent} from "../../fields/number-field/number-field.component";
import {Number4FieldComponent} from "../../fields/number4-field/number4-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-slider-properties",
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    EnumFieldComponent,
    ReactiveFormsModule,
    NumberFieldComponent,
    StringFieldComponent,
    Number4FieldComponent,
  ],
  templateUrl: "./slider-properties.component.html",
  styleUrl: "./slider-properties.component.css",
})
export class SliderPropertiesComponent extends AbstractPropertiesComponent<FIGSliderWidget> {
  step: number = 1;
  readonly precision: FormControl<number> = new FormControl<number>(2, {nonNullable: true});

  protected readonly FIGSliderType = FIGSliderType;
  protected readonly isInteger = FIGSliderWidget.isInteger;
  protected readonly getArraySize = FIGSliderWidget.getArraySize;

  constructor() {
    super();
    this.precision.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onPrecisionChanged.bind(this));
  }

  protected override load(): void {
    super.load();

    if (FIGSliderWidget.isFloat(this.widget.dataType)) {
      const precision: number | undefined = FIGSliderWidget.getPrecision(this.widget);
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

  private onDataTypeChanged(dataType: FIGSliderDataType): void {
    this.updateStep(dataType);
    this.updateValues(dataType);
    if (this.isInteger(dataType)) {
      this.widget.format = "%d";
      this.widget.valueSpeed = 0.5;
    } else {
      if (this.precision.value === 0) {
        this.precision.setValue(2, {emitEvent: false});
      }
      this.widget.format = `%.${this.precision.value}f`;
      this.widget.valueSpeed = 0.01;
    }
  }

  private onValueChanged(value: number[]): void {
    const round: number = 10 ** this.precision.value;

    for (let i: number = 0; i < 4; i++) {
      if (this.isInteger(this.widget.dataType)) {
        value[i] = Math.trunc(value[i]);
      } else {
        value[i] = Math.round(value[i] * round) / round;
      }
    }
  }

  private updateStep(dataType: FIGSliderDataType): void {
    if (this.isInteger(dataType)) {
      this.step = 1;
    } else {
      const round: number = 10 ** this.precision.value;

      this.step = 1 / round;
    }
  }

  private updateValues(dataType: FIGSliderDataType): void {
    const round: number = 10 ** this.precision.value;

    for (let i: number = 0; i < 4; i++) {
      if (this.isInteger(dataType)) {
        this.widget.value[i] = Math.trunc(this.widget.value[i]);
      } else {
        this.widget.value[i] = Math.round(this.widget.value[i] * round) / round;
      }
    }
  }
}
