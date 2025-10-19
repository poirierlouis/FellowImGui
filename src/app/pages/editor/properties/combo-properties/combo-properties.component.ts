import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGComboWidget} from "../../../../models/widgets/combo.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {ArrayStringFieldComponent} from "../../fields/array-string-field/array-string-field.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'fig-combo-properties',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    StringFieldComponent,
    ArrayStringFieldComponent
  ],
  templateUrl: './combo-properties.component.html',
  styleUrl: './combo-properties.component.css'
})
export class ComboPropertiesComponent extends AbstractPropertiesComponent<FIGComboWidget> {

  selectedItem: FormControl<string | null> = new FormControl({value: '', disabled: true});

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override load() {
    super.load();
    this.onSelectedItemChanged(this.getField<number>('selectedItem').value ?? 0);
  }

  private onSelectedItemChanged(item: number): void {
    const items: string[] = this.getField<string[]>('items').value ?? [];
    const selected: string = items[item];

    this.selectedItem.setValue(selected);
  }

}
