import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGSelectableFlags, FIGSelectableWidget} from "../../../../models/widgets/selectable.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-selectable-properties',
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
  templateUrl: './selectable-properties.component.html',
  styleUrl: './selectable-properties.component.css'
})
export class SelectablePropertiesComponent extends AbstractPropertiesComponent<FIGSelectableWidget> {

  readonly flags: FlagItem<FIGSelectableFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>('Text'),
    tooltip: new FormControl<string | null>(null),
    isSelected: new FormControl<boolean>(false),
    flags: new FormControl<string[]>([]),
    width: new FormControl<number | null>(null, {validators: Validators.min(0)}),
    height: new FormControl<number | null>(null, {validators: Validators.min(0)}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGSelectableWidget.flags) {
      this.flags.push({
        label: FIGSelectableFlags[flag],
        value: flag
      });
    }
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('isSelected').subscribe(this.onIsSelectedChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
    this.listenProperty('width').subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height').subscribe(this.onHeightChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('text', this.widget.text);
    this.setProperty('tooltip', this.widget.tooltip);
    this.setProperty('isSelected', this.widget.selected);
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
    this.setProperty('width', this.widget.size.width);
    this.setProperty('height', this.widget.size.height);
  }

  private onTextChanged(value: string): void {
    this.widget.text = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIsSelectedChanged(value: boolean): void {
    this.widget.selected = value;
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

  private onWidthChanged(value: number): void {
    if (!this.testProperty('width')) {
      this.setProperty('width', this.widget.size.width);
      return;
    }
    this.widget.size.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.testProperty('height')) {
      this.setProperty('height', this.widget.size.height);
      return;
    }
    this.widget.size.height = value;
    this.update.emit();
  }

}
