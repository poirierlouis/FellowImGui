import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonPropertiesComponent} from "./button-properties/button-properties.component";
import {TextPropertiesComponent} from "./text-properties/text-properties.component";
import {WindowPropertiesComponent} from "./window-properties/window-properties.component";
import {FIGWidget, FIGWidgetType} from "../../../models/widgets/widget";
import {CheckboxPropertiesComponent} from "./checkbox-properties/checkbox-properties.component";
import {RadioPropertiesComponent} from "./radio-properties/radio-properties.component";
import {LabelPropertiesComponent} from "./label-properties/label-properties.component";
import {ComboPropertiesComponent} from "./combo-properties/combo-properties.component";
import {InputTextPropertiesComponent} from "./input-text-properties/input-text-properties.component";
import {MatIcon} from "@angular/material/icon";
import {FIGWidgetFactory} from "../../../models/widgets/widget.factory";

@Component({
  selector: 'fig-properties',
  standalone: true,
  imports: [
    MatIcon,
    TextPropertiesComponent,
    ComboPropertiesComponent,
    LabelPropertiesComponent,
    RadioPropertiesComponent,
    ButtonPropertiesComponent,
    WindowPropertiesComponent,
    CheckboxPropertiesComponent,
    InputTextPropertiesComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget?: FIGWidget;
  widgetTitle?: string;

  protected readonly FIGWidgetType = FIGWidgetType;

  @Input('widget')
  set _widget(value: FIGWidget | undefined) {
    const prevWidget: FIGWidget | undefined = this.widget;

    this.widget = value;
    this.widgetTitle = (value !== undefined) ? FIGWidgetFactory.getTitle(value.type) : undefined;
    if (prevWidget) {
      prevWidget.isFocused = false;
    }
    if (this.widget) {
      this.widget.isFocused = true;
    }
  }

}
