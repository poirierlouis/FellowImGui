import {Component, DestroyRef} from '@angular/core';
import {FIGButtonWidget, FIGDir} from "../../../../models/widgets/button.widget";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {BoolFieldComponent} from "../../fields/bool-field/bool-field.component";
import {EnumFieldComponent} from "../../fields/enum-field/enum-field.component";

@Component({
  selector: 'fig-button-properties',
  standalone: true,
  imports: [
    BoolFieldComponent,
    EnumFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './button-properties.component.html',
  styleUrl: './button-properties.component.css'
})
export class ButtonPropertiesComponent extends AbstractPropertiesComponent<FIGButtonWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

  private onIsFillChanged(value: boolean): void {
    if (value) {
      this.resetIsSmall();
      this.resetArrow();
    }
  }

  private onIsSmallChanged(value: boolean): void {
    if (value) {
      this.resetIsFill();
      this.resetArrow();
    }
  }

  private onArrowChanged(value: FIGDir): void {
    if (value !== FIGDir.none) {
      this.resetIsFill();
      this.resetIsSmall();
    }
  }

  private resetIsFill(): void {
    if (!this.widget.isFill) {
      return;
    }
    this.widget.isFill = false;
  }

  private resetIsSmall(): void {
    if (!this.widget.isSmall) {
      return;
    }
    this.widget.isSmall = false;
  }

  private resetArrow(): void {
    if (this.widget.arrow === FIGDir.none) {
      return;
    }
    this.widget.arrow = FIGDir.none;
  }

}
