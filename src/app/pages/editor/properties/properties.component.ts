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
import {ProgressBarPropertiesComponent} from "./progress-bar-properties/progress-bar-properties.component";
import {InputNumberPropertiesComponent} from "./input-number-properties/input-number-properties.component";
import {InputColorEditPropertiesComponent} from "./input-color-edit-properties/input-color-edit-properties.component";
import {
  CollapsingHeaderPropertiesComponent
} from "./collapsing-header-properties/collapsing-header-properties.component";
import {InputTextareaPropertiesComponent} from "./input-textarea-properties/input-textarea-properties.component";
import {ListboxPropertiesComponent} from "./listbox-properties/listbox-properties.component";
import {TabBarPropertiesComponent} from "./tab-bar-properties/tab-bar-properties.component";
import {TabItemPropertiesComponent} from "./tab-item-properties/tab-item-properties.component";
import {PlotPropertiesComponent} from "./plot-properties/plot-properties.component";
import {FormatterService} from "../../../services/formatter.service";
import {MatTooltip} from "@angular/material/tooltip";
import {VerticalSliderPropertiesComponent} from "./vertical-slider-properties/vertical-slider-properties.component";
import {SameLinePropertiesComponent} from "./same-line-properties/same-line-properties.component";
import {DummyPropertiesComponent} from "./dummy-properties/dummy-properties.component";
import {TreeNodePropertiesComponent} from "./tree-node-properties/tree-node-properties.component";
import {SliderPropertiesComponent} from "./slider-properties/slider-properties.component";
import {ChildWindowPropertiesComponent} from "./child-window-properties/child-window-properties.component";
import {SelectablePropertiesComponent} from "./selectable-properties/selectable-properties.component";
import {ModalPropertiesComponent} from "./modal-properties/modal-properties.component";

@Component({
  selector: 'fig-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
    TextPropertiesComponent,
    PlotPropertiesComponent,
    ComboPropertiesComponent,
    LabelPropertiesComponent,
    RadioPropertiesComponent,
    DummyPropertiesComponent,
    ModalPropertiesComponent,
    ButtonPropertiesComponent,
    WindowPropertiesComponent,
    TabBarPropertiesComponent,
    SliderPropertiesComponent,
    TabItemPropertiesComponent,
    ListboxPropertiesComponent,
    CheckboxPropertiesComponent,
    SameLinePropertiesComponent,
    TreeNodePropertiesComponent,
    InputTextPropertiesComponent,
    SelectablePropertiesComponent,
    ProgressBarPropertiesComponent,
    InputNumberPropertiesComponent,
    ChildWindowPropertiesComponent,
    InputTextareaPropertiesComponent,
    InputColorEditPropertiesComponent,
    VerticalSliderPropertiesComponent,
    CollapsingHeaderPropertiesComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget?: FIGWidget;
  widgetTitle?: string;
  widgetWarning?: string;

  protected readonly FIGWidgetType = FIGWidgetType;

  constructor(private readonly formatterService: FormatterService) {
  }

  @Input('widget')
  set _widget(value: FIGWidget | undefined) {
    const prevWidget: FIGWidget | undefined = this.widget;
    const isSupported: boolean = (value !== undefined) ? this.formatterService.isSupported(value.type) : false;

    this.widget = value;
    this.widgetTitle = (value !== undefined) ? FIGWidgetFactory.getTitle(value.type) : undefined;
    this.widgetWarning = !isSupported ? `This widget is not supported by '${this.formatterService.currentLanguage}'.` : undefined;
    if (prevWidget) {
      prevWidget.isFocused = false;
    }
    if (this.widget) {
      this.widget.isFocused = true;
    }
  }

}
