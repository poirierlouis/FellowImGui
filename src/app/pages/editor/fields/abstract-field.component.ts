import {Component, DestroyRef, EventEmitter, Input, numberAttribute, OnInit, Output} from "@angular/core";
import {FormControl, ValidatorFn, Validators} from "@angular/forms";
import {Field} from "../../../models/fields/field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {None} from "../../../models/object";
import {debounceTime, map} from "rxjs";

@Component({
    selector: 'fig-abstract-field',
    template: '',
    standalone: false
})
export abstract class AbstractFieldComponent<F extends Field, FormType, FieldType = FormType | undefined> implements OnInit {

  @Input({transform: numberAttribute})
  debounce: number = 0;

  @Output()
  update: EventEmitter<F> = new EventEmitter();

  field!: F;
  form: FormControl<FormType> = new FormControl();

  protected constructor(protected readonly dr: DestroyRef) {
  }

  @Input({
    alias: 'field',
    transform: (value: Field) => value as F,
    required: true
  })
  set _field(field: F) {
    this.field?.removeListener(this.onFieldValueChanged.bind(this), this.onFieldStateChanged.bind(this));
    this.field = field;
    this.field.addListener(this.onFieldValueChanged.bind(this), this.onFieldStateChanged.bind(this));
    this.form.setValue(this.transformFromField(field.value as FieldType), {emitEvent: false});
    this.form.setValidators(this.getValidators());
    if (this.field.isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
    this.form.updateValueAndValidity();
    this.onFieldLoaded();
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.dr),
      this.debounce > 0 ? debounceTime(this.debounce) : map((x) => x),
    ).subscribe(this.onFormChanged.bind(this));
  }

  protected transformFromForm(value?: FormType): FieldType {
    return value as FieldType;
  }

  protected transformFromField(value?: FieldType): FormType {
    return value as FormType;
  }

  protected onFieldLoaded(): void {
    // NOTE: implemented by ...FieldComponent children
  }

  protected getValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.field.isRequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  protected onFieldValueChanged(value: FieldType): void {
    this.form.setValue(this.transformFromField(value), {emitEvent: false});
  }

  protected onFieldStateChanged(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
  }

  protected onFormChanged(): void {
    let formValue: FormType | None = this.form.value;

    if (formValue === null) {
      formValue = undefined;
    }
    const value: FieldType | undefined = this.transformFromForm(formValue);
    const prevValue: FieldType = this.field.value as FieldType;

    if (prevValue === value) {
      return;
    }
    if (this.field.isRequired && value === undefined) {
      return;
    }
    this.field.value = value;
    this.update.emit(this.field);
  }

}
