import {Component, DestroyRef} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {FIGCollapsingHeaderWidget} from "../../../../models/widgets/collapsing-header.widget";
import {MatOption, MatSelect} from "@angular/material/select";
import {FIGTreeNodeFlags, FIGTreeNodeWidget} from "../../../../models/widgets/tree-node.widget";

@Component({
  selector: 'fig-collapsing-header-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './collapsing-header-properties.component.html',
  styleUrl: './collapsing-header-properties.component.css'
})
export class CollapsingHeaderPropertiesComponent extends AbstractPropertiesComponent<FIGCollapsingHeaderWidget> {

  readonly flags: FlagItem<FIGTreeNodeFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGTreeNodeWidget.flags) {
      this.flags.push({
        label: FIGTreeNodeFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label);
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
