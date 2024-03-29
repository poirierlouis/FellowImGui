import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGWindowFlags, FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {FIGModalWidget} from "../../../../models/widgets/modal.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-modal-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './modal-properties.component.html',
  styleUrl: './modal-properties.component.css'
})
export class ModalPropertiesComponent extends AbstractPropertiesComponent<FIGModalWidget> {

  readonly flags: FlagItem<FIGWindowFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    flags: new FormControl<string[]>([]),
    debug: new FormControl<boolean>(true),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGWindowWidget.flags) {
      this.flags.push({
        label: FIGWindowFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
    this.listenProperty('debug').subscribe(this.onDebugChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('debug', this.widget.debug);
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onDebugChanged(value: boolean): void {
    this.widget.debug = value;
    this.update.emit();
  }

  private onFlagsChanged(value: number[]): void {
    for (const flag of this.flags) {
      const isEnabled: boolean = value.includes(flag.value);

      if (isEnabled) {
        this.widget.flags |= flag.value;
      } else if ((this.widget.flags & flag.value) === flag.value) {
        this.widget.flags ^= flag.value;
      }
    }
    this.update.emit();
  }

}
