import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import type {FIGListBoxWidget} from "../../../../models/widgets/listbox.widget";
import {ArrayStringFieldComponent} from "../../fields/array-string-field/array-string-field.component";
import {IntegerFieldComponent} from "../../fields/integer-field/integer-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-listbox-properties",
  imports: [ReactiveFormsModule, StringFieldComponent, IntegerFieldComponent, ArrayStringFieldComponent],
  templateUrl: "./listbox-properties.component.html",
  styleUrl: "./listbox-properties.component.css",
})
export class ListboxPropertiesComponent extends AbstractPropertiesComponent<FIGListBoxWidget> {
  maxItems: number | null = null;

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
