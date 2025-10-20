import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  inject,
  numberAttribute,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule, type ValidatorFn, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import type {Field} from "../../../../models/fields/field";
import type {Number4Field} from "../../../../models/fields/number4.field";

@Component({
  selector: "fig-number4-field",
  imports: [MatInput, MatLabel, MatFormField, ReactiveFormsModule],
  templateUrl: "./number4-field.component.html",
  styleUrl: "./number4-field.component.css",
})
export class Number4FieldComponent implements OnInit, OnChanges {
  private readonly dr = inject(DestroyRef);

  @Input({transform: numberAttribute})
  min: number | null = null;

  @Input({transform: numberAttribute})
  max: number | null = null;

  @Input({required: true, transform: numberAttribute})
  step: number = 1;

  @Input({transform: numberAttribute})
  size: number = 1;

  @Output()
  update: EventEmitter<Number4Field> = new EventEmitter();

  field!: Number4Field;

  forms: FormControl<number>[] = [
    new FormControl<number>(0, {nonNullable: true}),
    new FormControl<number>(0, {nonNullable: true}),
    new FormControl<number>(0, {nonNullable: true}),
    new FormControl<number>(0, {nonNullable: true}),
  ];

  @Input({
    alias: "field",
    transform: (value: Field<number | number[]>) => value as Number4Field,
    required: true,
  })
  set _field(field: Number4Field) {
    this.field?.removeListener(this.onFieldValueChanged.bind(this), this.onFieldStateChanged.bind(this));
    this.field = field;
    this.field.addListener(this.onFieldValueChanged.bind(this), this.onFieldStateChanged.bind(this));
    for (let i: number = 0; i < 4; i++) {
      const form: FormControl<number> = this.forms[i];

      if (this.field.value) {
        form.setValue(this.field.value[i], {emitEvent: false});
      }
      form.setValidators(this.getValidators());
      if (field.isDisabled) {
        form.disable({emitEvent: false});
      } else {
        form.enable({emitEvent: false});
      }
      form.updateValueAndValidity();
    }
    this.onFieldLoaded();
  }

  public ngOnInit(): void {
    this.forms.forEach((form, index) => {
      form.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe((value) => this.onFormChanged(value, index));
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["min"] || changes["max"]) {
      for (const form of this.forms) {
        form.setValidators(this.getValidators());
        form.updateValueAndValidity();
      }
    }
  }

  protected onFieldLoaded(): void {
    // NOTE: implemented by ...FieldComponent children
  }

  protected getValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.field.isRequired) {
      validators.push(Validators.required);
    }
    if (this.min !== null) {
      validators.push(Validators.min(this.min));
    }
    if (this.max !== null) {
      validators.push(Validators.max(this.max));
    }
    return validators;
  }

  protected onFieldValueChanged(value: number[]): void {
    for (let i: number = 0; i < 4; i++) {
      this.forms[i].setValue(value[i], {emitEvent: false});
    }
  }

  protected onFieldStateChanged(isDisabled: boolean): void {
    for (const form of this.forms) {
      if (isDisabled) {
        form.disable({emitEvent: false});
      } else {
        form.enable({emitEvent: false});
      }
    }
  }

  protected onFormChanged(value: number, index: number): void {
    if (this.field.value && this.field.value[index] === value) {
      return;
    }
    if (this.field.isRequired && value === undefined) {
      return;
    }
    if (this.field.value) {
      this.field.value[index] = value;
      this.update.emit(this.field);
    }
  }
}
