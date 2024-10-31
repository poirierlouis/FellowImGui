import {Component, DestroyRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {FormControl, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {SizeField} from "../../../../models/fields/size.field";
import {MatTooltip} from "@angular/material/tooltip";
import {isFloat, Size} from "../../../../models/math";
import {Field} from "../../../../models/fields/field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs";

@Component({
  selector: 'fig-size-field',
  standalone: true,
  imports: [
    MatIcon,
    MatLabel,
    MatInput,
    MatSuffix,
    MatTooltip,
    MatFormField,
    MatIconButton,
    ReactiveFormsModule
  ],
  templateUrl: './size-field.component.html',
  styleUrl: './size-field.component.css'
})
export class SizeFieldComponent implements OnInit {

  static showHelp: boolean = true;

  @Output()
  update: EventEmitter<SizeField> = new EventEmitter();

  field!: SizeField;
  width: FormControl<number | null> = new FormControl();
  height: FormControl<number | null> = new FormControl();

  min: number = -1;
  max: number | null = null;
  step: number = 1;

  acceptRelative: boolean = false;
  isRelative: boolean = false;

  constructor(protected readonly dr: DestroyRef) {

  }

  @Input({
    alias: 'field',
    transform: (value: Field) => value as SizeField,
    required: true
  })
  set _field(field: SizeField) {
    this.field?.removeListener(this.onFieldChanged.bind(this));
    this.field = field;
    this.field.addListener(this.onFieldChanged.bind(this));

    this.width.setValue(this.value?.width ?? null, {emitEvent: false});
    this.width.setValidators(this.getValidators());
    this.width.updateValueAndValidity();

    this.height.setValue(this.value?.height ?? null, {emitEvent: false});
    this.height.setValidators(this.getValidators());
    this.height.updateValueAndValidity();

    this.onFieldLoaded();
  }

  public get showHelp(): boolean {
    return SizeFieldComponent.showHelp;
  }

  private get value(): Size | undefined {
    return this.field.value;
  }

  public ngOnInit(): void {
    this.width.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.dr)
      )
      .subscribe((value) => this.onFormChanged('width', value));
    this.height.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.dr)
      )
      .subscribe((value) => this.onFormChanged('height', value));
  }

  public toggleRelative(): void {
    this.isRelative = !this.isRelative;
    if (this.isRelative) {
      this.field.value = {width: 0.5, height: 0.5};
      this.width.setValue(this.field.value.width * 100);
      this.height.setValue(this.field.value.height * 100);
      this.min = 0;
      this.max = 100;
      this.step = 10;
    } else {
      this.field.value = this.field.defaultValue ?? {width: 0, height: 0};
      this.width.setValue(this.field.value.width);
      this.height.setValue(this.field.value.height);
      this.min = -1;
      this.max = null;
      this.step = 1;
    }
    this.field.emit();
  }

  public hideHelp(): void {
    SizeFieldComponent.showHelp = false;
  }

  protected onFieldLoaded(): void {
    this.acceptRelative = this.field.acceptRelative;
    this.isRelative = false;
    this.min = -1;
    this.max = null;
    this.step = 1;
    if (!this.value) {
      return;
    }
    if (!this.field.isPercentage) {
      return;
    }
    this.isRelative = true;
    this.min = 0;
    this.max = 100;
    this.step = 10;
    this.width.setValue(this.value.width * 100, {emitEvent: false});
    this.height.setValue(this.value.height * 100, {emitEvent: false});
  }

  protected getValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.field.isRequired) {
      validators.push(Validators.required);
    }
    if (this.isRelative) {
      validators.push(Validators.min(0));
      validators.push(Validators.max(100));
    } else {
      validators.push(Validators.min(-1));
    }
    return [
      ...validators,
      Validators.pattern('\\d*'),
    ];
  }

  protected transform(value: number | null): number | null {
    if (value !== null && this.isRelative) {
      return value / 100.0;
    }
    return value;
  }

  protected onFieldChanged(value: unknown): void {
    let width: number | null = null;
    let height: number | null = null;

    if (value) {
      width = (value as Size).width;
      height = (value as Size).height;
      if (this.isRelative) {
        width *= 100.0;
        height *= 100.0;
      }
    }
    this.width.setValue(width, {emitEvent: false});
    this.height.setValue(height, {emitEvent: false});
  }

  protected onFormChanged(property: 'width' | 'height', value: number | null): void {
    if (value !== null && isFloat(value)) {
      return;
    }
    const prevValue: number | undefined = this.value?.[property];

    value = this.transform(value);
    if (prevValue === value) {
      return;
    }
    if (this.field.isRequired && value === null) {
      return;
    }
    if (value === null) {
      this.field.value = undefined;
      this.field.emit();
      return;
    }
    if (!this.field.value) {
      this.field.value = (this.isRelative) ? {width: 0.5, height: 0.5} : {width: 0, height: 0};
    }
    this.field.value[property] = value;
    this.field.emit();
  }

}
