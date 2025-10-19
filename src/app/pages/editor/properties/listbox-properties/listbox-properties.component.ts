import {Component, DestroyRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGListBoxWidget} from "../../../../models/widgets/listbox.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {ArrayStringFieldComponent} from "../../fields/array-string-field/array-string-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";

@Component({
  selector: 'fig-listbox-properties',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StringFieldComponent,
    IntegerFieldComponent,
    ArrayStringFieldComponent
  ],
  templateUrl: './listbox-properties.component.html',
  styleUrl: './listbox-properties.component.css'
})
export class ListboxPropertiesComponent extends AbstractPropertiesComponent<FIGListBoxWidget> {

  maxItems: number | null = null;

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override load(): void {
    super.load();
    this.maxItems = this.widget.items.length - 1;
  }

  private onItemsChanged(items: string[]): void {
    this.maxItems = items.length - 1;
    if (this.maxItems < 1) {
      this.maxItems = null;
    }
  }

}
