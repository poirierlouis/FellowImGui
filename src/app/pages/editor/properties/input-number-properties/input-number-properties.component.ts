import {Component} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {type FIGInputNumberType, FIGInputNumberWidget} from "../../../../models/widgets/input-number.widget";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {Number4FieldComponent} from "../../fields/number4-field/number4-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-input-number-properties",
  imports: [
    EnumFieldComponent,
    StringFieldComponent,
    IntegerFieldComponent,
    Number4FieldComponent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: "./input-number-properties.component.html",
  styleUrl: "./input-number-properties.component.css",
})
export class InputNumberPropertiesComponent extends AbstractPropertiesComponent<FIGInputNumberWidget> {
  step: number = 1;
  readonly precision: FormControl<number> = new FormControl<number>(2, {nonNullable: true});

  protected readonly isArray = FIGInputNumberWidget.isArray;
  protected readonly isInteger = FIGInputNumberWidget.isInteger;
  protected readonly getArraySize = FIGInputNumberWidget.getArraySize;

  constructor() {
    super();
    this.precision.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onPrecisionChanged.bind(this));
  }

  protected override load(): void {
    super.load();

    if (!this.isInteger(this.widget.dataType)) {
      const precision: number | undefined = FIGInputNumberWidget.getPrecision(this.widget);
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

  private onDataTypeChanged(dataType: FIGInputNumberType): void {
    this.updateStep(dataType);
    this.updateValues(dataType);
    if (this.isInteger(dataType)) {
      this.widget.format = "%d";
    } else {
      if (this.precision.value === 0) {
        this.precision.setValue(2, {emitEvent: false});
      }
      this.widget.format = `%.${this.precision.value}f`;
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

  private updateStep(dataType: FIGInputNumberType): void {
    if (this.isInteger(dataType)) {
      this.step = 1;
    } else {
      const round: number = 10 ** this.precision.value;

      this.step = 1 / round;
    }
  }

  private updateValues(dataType: FIGInputNumberType): void {
    const round: number = 10 ** this.precision.value;
    const values = this.widget.value;

    for (let i: number = 0; i < 4; i++) {
      if (this.isInteger(dataType)) {
        values[i] = Math.trunc(values[i]);
      } else {
        values[i] = Math.round(values[i] * round) / round;
      }
    }
    this.widget.value = values;
  }
}
