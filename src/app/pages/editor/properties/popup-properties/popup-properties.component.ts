import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGPopupWidget} from "../../../../models/widgets/popup.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";

@Component({
  selector: 'fig-popup-properties',
  standalone: true,
  imports: [
    MatLabel,
    MatSlideToggle,
    BoolFieldComponent,
    ReactiveFormsModule,
    StringFieldComponent
  ],
  templateUrl: './popup-properties.component.html',
  styleUrl: './popup-properties.component.css'
})
export class PopupPropertiesComponent extends AbstractPropertiesComponent<FIGPopupWidget> {

  readonly debug: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  constructor(dr: DestroyRef) {
    super(dr);
    this.debug.valueChanges.pipe(takeUntilDestroyed(dr)).subscribe(this.onDebug.bind(this));
  }

  protected override load(): void {
    super.load();
    this.debug.setValue(this.widget.debug, {emitEvent: false});
  }

  private onDebug(value: boolean): void {
    this.widget.debug = value;
  }

}
