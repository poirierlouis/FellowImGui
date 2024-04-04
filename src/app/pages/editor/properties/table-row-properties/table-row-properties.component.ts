import {Component, DestroyRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTableRowWidget} from "../../../../models/widgets/table-row.widget";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-table-row-properties',
  standalone: true,
  imports: [
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './table-row-properties.component.html',
  styleUrl: './table-row-properties.component.css'
})
export class TableRowPropertiesComponent extends AbstractPropertiesComponent<FIGTableRowWidget> {

  override form: FormGroup = new FormGroup<any>({
    header: new FormControl<boolean>(false),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('header').subscribe(this.onHeaderChanged.bind(this));
  }

  protected override updateForm() {
    this.setProperty('header', this.widget.header);
  }

  private onHeaderChanged(value: boolean): void {
    this.widget.header = value;
    this.update.emit();
  }

}
