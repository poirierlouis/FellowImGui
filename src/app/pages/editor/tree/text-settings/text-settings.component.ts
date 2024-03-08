import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widget";
import {FIGTextWidget} from "../../../../models/text.widget";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'fig-text-settings',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './text-settings.component.html',
  styleUrl: './text-settings.component.css'
})
export class TextSettingsComponent {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: FIGTextWidget;

  form: FormGroup = new FormGroup<any>({
    text: new FormControl('')
  });

  constructor(private readonly dr: DestroyRef) {
    this.form.get('text')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onTextChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.widget = value as FIGTextWidget;
    this.form.get('text')!.setValue(this.widget.text, {emitEvent: false});
  }

  private onTextChanged(value: string): void {
    this.widget.text = value;
    this.update.emit();
  }

}
