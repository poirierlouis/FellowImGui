import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGComboWidget} from "../../../../models/widgets/combo.widget";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'fig-combo-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './combo-properties.component.html',
  styleUrl: './combo-properties.component.css'
})
export class ComboPropertiesComponent extends AbstractPropertiesComponent<FIGComboWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    items: new FormControl<string | null>(null),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('items', 300).subscribe(this.onItemsChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('items', this.widget.items.join('\n'));
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onItemsChanged(value: string | null): void {
    value ??= '';
    const items: string[] = value!.split('\n');

    this.widget.items.length = 0;
    this.widget.items.push(...items);
    this.widget.selectedIndex = 0;
    this.update.emit();
  }

}
