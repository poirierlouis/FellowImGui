import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widget";
import {FIGButtonWidget} from "../../../../models/button.widget";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'fig-button-settings',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './button-settings.component.html',
  styleUrl: './button-settings.component.css'
})
export class ButtonSettingsComponent {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: FIGButtonWidget;

  form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
  });

  constructor(private readonly dr: DestroyRef) {
    this.form.get('text')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onTextChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.widget = value as FIGButtonWidget;
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
  }

  private onTextChanged(value: string): void {
    this.widget.text = value;
    this.update.emit();
  }

}
