import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FIGDocument} from "../../../models/document";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGThemeColors} from "../../../models/document-styles";

@Component({
  selector: 'fig-config',
  standalone: true,
  imports: [
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  @Output()
  readonly update: EventEmitter<void> = new EventEmitter<void>();

  readonly form: FormGroup = new FormGroup<any>({
    theme: new FormControl<FIGThemeColors>('dark'),
  });

  private document!: FIGDocument;

  constructor() {
    this.form.get('theme')!.valueChanges.subscribe(this.onThemeChanged.bind(this));
  }

  @Input('document')
  public set _document(value: FIGDocument) {
    this.document = value;
    this.updateForm();
  }

  public updateForm(): void {
    this.form.get('theme')!.setValue(this.document.styles.theme, {emitEvent: false});
  }

  private onThemeChanged(value: FIGThemeColors): void {
    this.document.styles.theme = value;
    this.update.emit();
  }

}
