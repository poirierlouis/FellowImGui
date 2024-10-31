import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGInputTextareaWidget} from "../../../../models/widgets/input-textarea.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-input-textarea-properties',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlagsFieldComponent,
    StringFieldComponent,
    IntegerFieldComponent
  ],
  templateUrl: './input-textarea-properties.component.html',
  styleUrl: './input-textarea-properties.component.css'
})
export class InputTextareaPropertiesComponent extends AbstractPropertiesComponent<FIGInputTextareaWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  private onValueChanged(value: string): void {
    if (value.length > this.widget.bufferSize) {
      this.widget.bufferSize = value.length;
    }
  }

  private onBufferSizeChanged(value: number): void {
    if (value < this.widget.value.length) {
      this.widget.value = this.widget.value.substring(0, value);
    }
  }

}
