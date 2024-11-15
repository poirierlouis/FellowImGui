import {Component, DestroyRef, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, ValidatorFn, Validators} from "@angular/forms";
import {Field} from "../../../models/fields/field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'fig-abstract-field',
  template: ''
})
export abstract class AbstractFieldComponent<F extends Field, FormType, FieldType = FormType | undefined> implements OnInit {

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
    this.field?.removeListener(this.onFieldChanged.bind(this));
    this.field = field;
    this.field.addListener(this.onFieldChanged.bind(this));
    this.form.setValue(this.transformFromField(field.value as FieldType), {emitEvent: false});
    this.form.setValidators(this.getValidators());
    this.form.updateValueAndValidity();
    this.onFieldLoaded();
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onFormChanged.bind(this));
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

  protected onFieldChanged(value: FieldType): void {
    this.form.setValue(this.transformFromField(value), {emitEvent: false});
  }

  protected onFormChanged(): void {
    const prevValue: FieldType = this.field.value as FieldType;
    const value: FieldType | undefined = this.transformFromForm(this.form.value);

    if (prevValue === value) {
      return;
    }
    if (this.field.isRequired && value === undefined) {
      return;
    }
    this.field.value = value;
    this.field.emit();
    this.update.emit(this.field);
  }

}
