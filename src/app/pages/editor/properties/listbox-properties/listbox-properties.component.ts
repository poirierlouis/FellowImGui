import {Component, DestroyRef} from '@angular/core';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGListBoxWidget} from "../../../../models/widgets/listbox.widget";

@Component({
  selector: 'fig-listbox-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './listbox-properties.component.html',
  styleUrl: './listbox-properties.component.css'
})
export class ListboxPropertiesComponent extends AbstractPropertiesComponent<FIGListBoxWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    items: new FormControl<string | null>(null),
    itemsSize: new FormControl<number>(4, {validators: Validators.min(1)}),
    selectedItem: new FormControl<string>({value: '', disabled: true}),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('items', 300).subscribe(this.onItemsChanged.bind(this));
    this.listenProperty('itemsSize').subscribe(this.onItemsSizeChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('items', this.widget.items.join('\n'));
    this.setProperty('itemsSize', this.widget.itemsSize);
    this.setProperty('selectedItem', this.widget.items[this.widget.selectedItem]);
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
    this.widget.selectedItem = 0;
    this.setProperty('selectedItem', this.widget.items[0]);
    this.update.emit();
  }

  private onItemsSizeChanged(value: number): void {
    if (!this.testProperty('itemsSize')) {
      this.setProperty('itemsSize', this.widget.itemsSize);
      return;
    }
    this.widget.itemsSize = value;
    this.update.emit();
  }

}
