import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonPropertiesComponent} from "./button-properties/button-properties.component";
import {TextPropertiesComponent} from "./text-properties/text-properties.component";
import {WindowPropertiesComponent} from "./window-properties/window-properties.component";
import {FIGWidget, FIGWidgetType} from "../../../models/widgets/widget";
import {CheckboxPropertiesComponent} from "./checkbox-properties/checkbox-properties.component";
import {SeparatorPropertiesComponent} from "./separator-properties/separator-properties.component";

@Component({
  selector: 'fig-properties',
  standalone: true,
  imports: [
    TextPropertiesComponent,
    ButtonPropertiesComponent,
    WindowPropertiesComponent,
    CheckboxPropertiesComponent,
    SeparatorPropertiesComponent
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

  @Input()
  widget?: FIGWidget;

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  protected readonly FIGWidgetType = FIGWidgetType;

}
