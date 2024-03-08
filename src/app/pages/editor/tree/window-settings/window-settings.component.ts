import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {FIGWindowWidget} from "../../../../models/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widget";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'fig-window-settings',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './window-settings.component.html',
  styleUrl: './window-settings.component.css'
})
export class WindowSettingsComponent {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: FIGWindowWidget;

  form: FormGroup = new FormGroup<any>({
    title: new FormControl<string>(''),
  });

  constructor(private readonly dr: DestroyRef) {
    this.form.get('title')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onTitleChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.widget = value as FIGWindowWidget;
    this.form.get('title')!.setValue(this.widget.title, {emitEvent: false});
  }

  private onTitleChanged(value: string): void {
    this.widget.title = value;
    this.update.emit();
  }

}
