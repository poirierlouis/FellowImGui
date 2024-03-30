import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGMenuWidget} from "../../../../models/widgets/menu.widget";

@Component({
  selector: 'fig-menu-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './menu-properties.component.html',
  styleUrl: './menu-properties.component.css'
})
export class MenuPropertiesComponent extends AbstractPropertiesComponent<FIGMenuWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    enabled: new FormControl<boolean>(true),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('enabled').subscribe(this.onEnabledChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label);
    this.setProperty('enabled', this.widget.enabled);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onEnabledChanged(value: boolean): void {
    this.widget.enabled = value;
    this.update.emit();
  }

}
