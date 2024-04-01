import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGBlocForWidget} from "../../../../models/widgets/bloc-for.widget";

@Component({
  selector: 'fig-bloc-for-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './bloc-for-properties.component.html',
  styleUrl: './bloc-for-properties.component.css'
})
export class BlocForPropertiesComponent extends AbstractPropertiesComponent<FIGBlocForWidget> {

  override form: FormGroup = new FormGroup<any>({
    size: new FormControl<number>(10, {validators: Validators.min(1)}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('size').subscribe(this.onSizeChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('size', this.widget.size);
  }

  private onSizeChanged(value: number): void {
    if (!this.testProperty('size')) {
      this.setProperty('size', this.widget.size);
      return;
    }
    this.widget.size = value;
    this.update.emit();
  }

}
