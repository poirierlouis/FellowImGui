import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGPlotType, FIGPlotWidget} from "../../../../models/widgets/plot.widget";
import {Size} from '../../../../models/math';
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-plot-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './plot-properties.component.html',
  styleUrl: './plot-properties.component.css'
})
export class PlotPropertiesComponent extends AbstractPropertiesComponent<FIGPlotWidget> {

  override form: FormGroup = new FormGroup<any>({
    plotType: new FormControl<FIGPlotType>(FIGPlotType.lines),
    label: new FormControl<string>(''),
    valueOffset: new FormControl<number | null>(null, {validators: Validators.min(0)}),
    scaleMin: new FormControl<number | null>(null),
    scaleMax: new FormControl<number | null>(null),
    width: new FormControl<number | null>(null),
    height: new FormControl<number | null>(null),
    overlayText: new FormControl<string | null>(null),
    stride: new FormControl<number | null>(null, {validators: Validators.min(1)}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('plotType').subscribe(this.onPlotTypeChanged.bind(this));
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('valueOffset').subscribe(this.onValueOffsetChanged.bind(this));
    this.listenProperty('scaleMin').subscribe(this.onScaleMinChanged.bind(this));
    this.listenProperty('scaleMax').subscribe(this.onScaleMaxChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('overlayText').subscribe(this.onOverlayTextChanged.bind(this));
    this.listenProperty('stride').subscribe(this.onStrideChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('plotType', this.widget.plotType);
    this.setProperty('label', this.widget.label);
    this.setProperty('valueOffset', this.widget.valueOffset ?? null);
    this.setProperty('scaleMin', this.widget.scaleMin ?? null);
    this.setProperty('scaleMax', this.widget.scaleMax ?? null);
    this.setProperty('width', this.widget.size?.width ?? null);
    this.setProperty('height', this.widget.size?.height ?? null);
    this.setProperty('overlayText', this.widget.overlayText ?? null);
    this.setProperty('stride', this.widget.stride ?? null);
  }

  private onPlotTypeChanged(value: FIGPlotType): void {
    this.widget.plotType = value;
    this.update.emit();
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onValueOffsetChanged(value: number | null): void {
    if (!this.testProperty('valueOffset')) {
      this.setProperty('valueOffset', this.widget.valueOffset ?? null);
      return;
    }
    this.widget.valueOffset = value ?? undefined;
    this.update.emit();
  }

  private onScaleMinChanged(value: number | null): void {
    this.widget.scaleMin = value ?? undefined;
    this.update.emit();
  }

  private onScaleMaxChanged(value: number | null): void {
    this.widget.scaleMax = value ?? undefined;
    this.update.emit();
  }

  private onWidthChanged(value: number | null): void {
    const size: Size = this.widget.size ?? {width: 0, height: 0};

    size.width = value ?? 0;
    this.widget.size = size;
    this.update.emit();
  }

  private onHeightChanged(value: number | null): void {
    const size: Size = this.widget.size ?? {width: 0, height: 0};

    size.height = value ?? 0;
    this.widget.size = size;
    this.update.emit();
  }

  private onStrideChanged(value: number | null): void {
    if (!this.testProperty('stride')) {
      this.setProperty('stride', this.widget.stride ?? null);
      return;
    }
    this.widget.stride = value ?? undefined;
    this.update.emit();
  }

  private onOverlayTextChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.overlayText = value ?? undefined;
    this.update.emit();
  }

  protected readonly FIGPlotType = FIGPlotType;
}
