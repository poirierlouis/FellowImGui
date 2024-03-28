import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGWindowFlags, FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {FIGChildWindowWidget} from "../../../../models/widgets/child-window.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'fig-child-window-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatIconButton,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './child-window-properties.component.html',
  styleUrl: './child-window-properties.component.css'
})
export class ChildWindowPropertiesComponent extends AbstractPropertiesComponent<FIGChildWindowWidget> {

  readonly flags: FlagItem<FIGWindowFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    width: new FormControl<number | null>(null),
    height: new FormControl<number | null>(null),
    frameBorder: new FormControl<boolean>(true),
    flags: new FormControl<string[]>([]),
  });

  showHelpSize: boolean = false;

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGWindowWidget.flags) {
      this.flags.push({
        label: FIGWindowFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('width', 300).subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height', 300).subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('frameBorder').subscribe(this.onFrameBorderChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('width', this.widget.size.width);
    this.setProperty('height', this.widget.size.height);
    this.setProperty('frameBorder', this.widget.frameBorder);
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

  private onWidthChanged(value: number | null): void {
    if (!this.testProperty('width') || value === null) {
      this.setProperty('width', this.widget.size.width);
      return;
    }
    this.widget.size.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number | null): void {
    if (!this.testProperty('height') || value === null) {
      this.setProperty('height', this.widget.size.height);
      return;
    }
    this.widget.size.height = value;
    this.update.emit();
  }

  private onFrameBorderChanged(value: boolean): void {
    this.widget.frameBorder = value;
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
