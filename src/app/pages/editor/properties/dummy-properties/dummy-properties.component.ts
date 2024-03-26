import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGDummyWidget} from "../../../../models/widgets/dummy.widget";

@Component({
  selector: 'fig-dummy-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './dummy-properties.component.html',
  styleUrl: './dummy-properties.component.css'
})
export class DummyPropertiesComponent extends AbstractPropertiesComponent<FIGDummyWidget> {

  override form: FormGroup = new FormGroup<any>({
    width: new FormControl<number>(100, {validators: Validators.min(0)}),
    height: new FormControl<number>(100, {validators: Validators.min(0)}),
    tooltip: new FormControl<string | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('width', this.widget.width);
    this.setProperty('height', this.widget.height);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
  }

  private onWidthChanged(value: number): void {
    if (!this.testProperty('width')) {
      this.setProperty('width', this.widget.width);
      return;
    }
    this.widget.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.testProperty('height')) {
      this.setProperty('height', this.widget.height);
      return;
    }
    this.widget.height = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

}
