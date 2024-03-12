import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGButtonWidget} from "../../../../models/widgets/button.widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: 'fig-button-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
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
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
  }

  protected override updateForm() {
    if (!this.widget) {
      return;
    }
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

}
