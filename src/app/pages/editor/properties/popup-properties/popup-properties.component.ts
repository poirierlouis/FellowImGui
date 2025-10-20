import {Component} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import type {FIGPopupWidget} from "../../../../models/widgets/popup.widget";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-popup-properties",
  imports: [MatLabel, MatSlideToggle, BoolFieldComponent, ReactiveFormsModule, StringFieldComponent],
  templateUrl: "./popup-properties.component.html",
  styleUrl: "./popup-properties.component.css",
})
export class PopupPropertiesComponent extends AbstractPropertiesComponent<FIGPopupWidget> {
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
