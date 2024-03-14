import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGArrowDirection, FIGButtonWidget} from "../../../../models/widgets/button.widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-button-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './button-properties.component.html',
  styleUrl: './button-properties.component.css'
})
export class ButtonPropertiesComponent extends AbstractPropertiesComponent<FIGButtonWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    isSmall: new FormControl<boolean>(false),
    arrow: new FormControl<FIGArrowDirection>(FIGArrowDirection.none),
  });

  protected readonly FIGArrowDirection = FIGArrowDirection;

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('isSmall').subscribe(this.onIsSmallChanged.bind(this));
    this.listenProperty('arrow').subscribe(this.onArrowChanged.bind(this));
  }

  protected override updateForm() {
    if (!this.widget) {
      return;
    }
    this.setProperty('text', this.widget.text);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('isSmall', this.widget.isSmall);
    this.setProperty('arrow', this.widget.arrow);
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIsSmallChanged(value: boolean): void {
    this.widget!.isSmall = value;
    if (value && this.widget!.arrow !== FIGArrowDirection.none) {
      this.setProperty('arrow', FIGArrowDirection.none);
      this.widget!.arrow = FIGArrowDirection.none;
    }
    this.update.emit();
  }

  private onArrowChanged(value: FIGArrowDirection): void {
    this.widget!.arrow = value;
    if (value && this.widget!.isSmall) {
      this.setProperty('isSmall', false);
      this.widget!.isSmall = false;
    }
    this.update.emit();
  }

}
