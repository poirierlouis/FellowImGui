import {Component} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import type {FIGComboWidget} from "../../../../models/widgets/combo.widget";
import {ArrayStringFieldComponent} from "../../fields/array-string-field/array-string-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-combo-properties",
  imports: [MatLabel, MatInput, MatFormField, ReactiveFormsModule, StringFieldComponent, ArrayStringFieldComponent],
  templateUrl: "./combo-properties.component.html",
  styleUrl: "./combo-properties.component.css",
})
export class ComboPropertiesComponent extends AbstractPropertiesComponent<FIGComboWidget> {
  readonly selectedItem: FormControl<string | null> = new FormControl({value: "", disabled: true});

  protected override load() {
    super.load();
    this.onSelectedItemChanged(this.getField<number>("selectedItem").value ?? 0);
  }

  private onSelectedItemChanged(item: number): void {
    const items: string[] = this.getField<string[]>("items").value ?? [];
    const selected: string = items[item];

    this.selectedItem.setValue(selected);
  }
}
