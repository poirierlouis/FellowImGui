import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGSameLineWidget} from "../../../../models/widgets/same-line.widget";

@Component({
  selector: 'fig-same-line-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './same-line-properties.component.html',
  styleUrl: './same-line-properties.component.css'
})
export class SameLinePropertiesComponent extends AbstractPropertiesComponent<FIGSameLineWidget> {

  override form: FormGroup = new FormGroup<any>({
    offsetFromStart: new FormControl<number | null>(null),
    spacing: new FormControl<number | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('offsetFromStart').subscribe(this.onOffsetFromStartChanged.bind(this));
    this.listenProperty('spacing').subscribe(this.onSpacingChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('offsetFromStart', this.widget.offsetFromStart ?? null);
    this.setProperty('spacing', this.widget.spacing ?? null);
  }

  private onOffsetFromStartChanged(value: number | null): void {
    this.widget.offsetFromStart = value ?? undefined;
    this.update.emit();
  }

  private onSpacingChanged(value: number | null): void {
    this.widget.spacing = value ?? undefined;
    this.update.emit();
  }

}
