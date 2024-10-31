import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGInputTextWidget} from "../../../../models/widgets/input-text.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-input-text-properties',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlagsFieldComponent,
    StringFieldComponent,
    IntegerFieldComponent
  ],
  templateUrl: './input-text-properties.component.html',
  styleUrl: './input-text-properties.component.css'
})
export class InputTextPropertiesComponent extends AbstractPropertiesComponent<FIGInputTextWidget> {

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
