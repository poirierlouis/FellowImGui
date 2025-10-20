import {Component} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import type {FIGModalWidget} from "../../../../models/widgets/modal.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-modal-properties",
  imports: [MatLabel, MatSlideToggle, ReactiveFormsModule, FlagsFieldComponent, StringFieldComponent],
  templateUrl: "./modal-properties.component.html",
  styleUrl: "./modal-properties.component.css",
})
export class ModalPropertiesComponent extends AbstractPropertiesComponent<FIGModalWidget> {
  readonly debug: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  constructor() {
    super();
    this.debug.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onDebug.bind(this));
  }

  protected override load(): void {
    super.load();
    this.debug.setValue(this.widget.debug, {emitEvent: false});
  }

  private onDebug(value: boolean): void {
    this.widget.debug = value;
  }
}
