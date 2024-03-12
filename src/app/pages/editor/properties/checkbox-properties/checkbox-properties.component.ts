import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGCheckboxWidget} from "../../../../models/widgets/checkbox.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-checkbox-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatSlideToggle
  ],
  templateUrl: './checkbox-properties.component.html',
  styleUrl: './checkbox-properties.component.css'
})
export class CheckboxPropertiesComponent extends AbstractPropertiesComponent<FIGCheckboxWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    isChecked: new FormControl<boolean>(false),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('isChecked').subscribe(this.onIsCheckedChanged.bind(this));
  }

  protected override updateForm(): void {
    if (!this.widget) {
      return;
    }
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
    this.form.get('isChecked')!.setValue(this.widget.isChecked, {emitEvent: false});
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onIsCheckedChanged(value: boolean): void {
    this.widget!.isChecked = value;
    this.update.emit();
  }

}
