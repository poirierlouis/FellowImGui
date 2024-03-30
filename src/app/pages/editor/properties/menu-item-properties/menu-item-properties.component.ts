import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGMenuItemWidget} from "../../../../models/widgets/menu-item.widget";

@Component({
  selector: 'fig-menu-item-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './menu-item-properties.component.html',
  styleUrl: './menu-item-properties.component.css'
})
export class MenuItemPropertiesComponent extends AbstractPropertiesComponent<FIGMenuItemWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    shortcut: new FormControl<string | null>(null),
    isSelectable: new FormControl<boolean>(false),
    isSelected: new FormControl<boolean>({value: false, disabled: true}),
    enabled: new FormControl<boolean>(true),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('shortcut').subscribe(this.onShortcutChanged.bind(this));
    this.listenProperty('isSelectable').subscribe(this.onIsSelectableChanged.bind(this));
    this.listenProperty('isSelected').subscribe(this.onIsSelectedChanged.bind(this));
    this.listenProperty('enabled').subscribe(this.onEnabledChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label);
    this.setProperty('shortcut', this.widget.shortcut ?? null);
    this.setProperty('isSelectable', this.widget.isSelectable);
    this.setProperty('isSelected', this.widget.isSelected);
    if (this.widget.isSelectable) {
      this.enableProperty('isSelected');
    }
    this.setProperty('enabled', this.widget.enabled);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onShortcutChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget.shortcut = value ?? undefined;
    this.update.emit();
  }

  private onIsSelectableChanged(value: boolean): void {
    this.widget.isSelectable = value;
    if (this.widget.isSelectable) {
      this.enableProperty('isSelected');
    } else {
      this.disableProperty('isSelected');
    }
    this.update.emit();
  }

  private onIsSelectedChanged(value: boolean): void {
    this.widget.isSelected = value;
    this.update.emit();
  }

  private onEnabledChanged(value: boolean): void {
    this.widget.enabled = value;
    this.update.emit();
  }

}
