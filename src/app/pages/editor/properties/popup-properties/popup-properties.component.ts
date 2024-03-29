import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGPopupWidget} from "../../../../models/widgets/popup.widget";

@Component({
  selector: 'fig-popup-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './popup-properties.component.html',
  styleUrl: './popup-properties.component.css'
})
export class PopupPropertiesComponent extends AbstractPropertiesComponent<FIGPopupWidget> {

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    contextItem: new FormControl<boolean>(false),
    debugLabel: new FormControl<string | null>('Open \'\''),
    debug: new FormControl<boolean>(true),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('contextItem').subscribe(this.onContextItemChanged.bind(this));
    this.listenProperty('debugLabel').subscribe(this.onDebugLabelChanged.bind(this));
    this.listenProperty('debug').subscribe(this.onDebugChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('label', this.widget.label);
    this.setProperty('contextItem', this.widget.contextItem);
    this.setProperty('debugLabel', this.widget.debugLabel);
    this.setProperty('debug', this.widget.debug);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onContextItemChanged(value: boolean): void {
    this.widget.contextItem = value;
    this.update.emit();
  }

  private onDebugLabelChanged(value: string): void {
    this.widget.debugLabel = value;
    this.update.emit();
  }

  private onDebugChanged(value: boolean): void {
    this.widget.debug = value;
    this.update.emit();
  }

}
