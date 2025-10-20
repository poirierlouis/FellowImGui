import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGInputTextWidget} from "../../../../models/widgets/input-text.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-input-text-properties",
  imports: [ReactiveFormsModule, FlagsFieldComponent, StringFieldComponent, IntegerFieldComponent],
  templateUrl: "./input-text-properties.component.html",
  styleUrl: "./input-text-properties.component.css",
})
export class InputTextPropertiesComponent extends AbstractPropertiesComponent<FIGInputTextWidget> {
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
