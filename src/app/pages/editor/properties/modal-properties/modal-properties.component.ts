import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGModalWidget} from "../../../../models/widgets/modal.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'fig-modal-properties',
  standalone: true,
  imports: [
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule,
    FlagsFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './modal-properties.component.html',
  styleUrl: './modal-properties.component.css'
})
export class ModalPropertiesComponent extends AbstractPropertiesComponent<FIGModalWidget> {

  readonly debug: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  constructor(dr: DestroyRef) {
    super(dr);
    this.debug.valueChanges.pipe(takeUntilDestroyed(dr)).subscribe(this.onDebug.bind(this))
  }

  protected override load(): void {
    super.load();
    this.debug.setValue(this.widget.debug, {emitEvent: false});
  }

  private onDebug(value: boolean): void {
    this.widget.debug = value;
  }

}
