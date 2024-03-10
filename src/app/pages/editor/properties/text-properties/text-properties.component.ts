import {Component, DestroyRef, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGTextWidget} from "../../../../models/widgets/text.widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: 'fig-text-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './text-properties.component.html',
  styleUrl: './text-properties.component.css'
})
export class TextPropertiesComponent extends AbstractPropertiesComponent<FIGTextWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl('')
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.dispose();
    this.widget = value as FIGTextWidget;
    this.load();
  }

  protected override updateForm(): void {
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
