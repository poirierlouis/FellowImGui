import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGMenuItemWidget} from "../../../../models/widgets/menu-item.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";

@Component({
    selector: 'fig-menu-item-properties',
    imports: [
        BoolFieldComponent,
        StringFieldComponent
    ],
    templateUrl: './menu-item-properties.component.html',
    styleUrl: './menu-item-properties.component.css'
})
export class MenuItemPropertiesComponent extends AbstractPropertiesComponent<FIGMenuItemWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  protected override load(): void {
    super.load();
    if (this.widget.isSelectable) {
      this.getField('isSelected').enable();
    } else {
      this.getField('isSelected').disable();
    }
  }

  private onIsSelectableChanged(value: boolean): void {
    this.widget.isSelectable = value;
    if (this.widget.isSelectable) {
      this.getField('isSelected').enable();
    } else {
      this.getField('isSelected').disable();
    }
    this.update.emit();
  }
}
