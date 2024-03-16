import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGProgressBarWidget} from "../../../../models/widgets/progress-bar.widget";
import {MatSliderModule} from "@angular/material/slider";

@Component({
  selector: 'fig-progress-bar-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    MatSliderModule,
    ReactiveFormsModule
  ],
  templateUrl: './progress-bar-properties.component.html',
  styleUrl: './progress-bar-properties.component.css'
})
export class ProgressBarPropertiesComponent extends AbstractPropertiesComponent<FIGProgressBarWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    value: new FormControl<number>(0),
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    isFill: new FormControl<boolean>(false),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('value').subscribe(this.onValueChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('isFill').subscribe(this.onIsFillChanged.bind(this));
  }

  public formatPercentage(value: number): string {
    return `${value}%`;
  }

  protected override updateForm(): void {
    if (!this.widget) {
      return;
    }
    this.setProperty('value', this.widget.value * 100);
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('isFill', this.widget.isFill);
  }

  private onValueChanged(value: number): void {
    this.widget!.value = value / 100;
    this.update.emit();
  }

  private onLabelChanged(value: string): void {
    this.widget!.label = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIsFillChanged(value: boolean): void {
    this.widget!.isFill = value;
    this.update.emit();
  }

}
