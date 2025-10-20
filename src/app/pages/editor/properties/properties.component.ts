import {AsyncPipe} from "@angular/common";
import {Component, EventEmitter, Input, inject, Output} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {combineLatestWith, map, type Observable, of} from "rxjs";
import {type FIGWidget, FIGWidgetType} from "../../../models/widgets/widget";
import {FIGWidgetFactory} from "../../../models/widgets/widget.factory";
import {FormatterService} from "../../../services/formatter.service";
import {BlocForPropertiesComponent} from "./bloc-for-properties/bloc-for-properties.component";
import {ButtonPropertiesComponent} from "./button-properties/button-properties.component";
import {CheckboxPropertiesComponent} from "./checkbox-properties/checkbox-properties.component";
import {ChildWindowPropertiesComponent} from "./child-window-properties/child-window-properties.component";
import {CollapsingHeaderPropertiesComponent} from "./collapsing-header-properties/collapsing-header-properties.component";
import {ComboPropertiesComponent} from "./combo-properties/combo-properties.component";
import {DummyPropertiesComponent} from "./dummy-properties/dummy-properties.component";
import {InputColorEditPropertiesComponent} from "./input-color-edit-properties/input-color-edit-properties.component";
import {InputNumberPropertiesComponent} from "./input-number-properties/input-number-properties.component";
import {InputTextPropertiesComponent} from "./input-text-properties/input-text-properties.component";
import {InputTextareaPropertiesComponent} from "./input-textarea-properties/input-textarea-properties.component";
import {LabelPropertiesComponent} from "./label-properties/label-properties.component";
import {ListboxPropertiesComponent} from "./listbox-properties/listbox-properties.component";
import {MenuItemPropertiesComponent} from "./menu-item-properties/menu-item-properties.component";
import {MenuPropertiesComponent} from "./menu-properties/menu-properties.component";
import {ModalPropertiesComponent} from "./modal-properties/modal-properties.component";
import {PlotPropertiesComponent} from "./plot-properties/plot-properties.component";
import {PopupPropertiesComponent} from "./popup-properties/popup-properties.component";
import {ProgressBarPropertiesComponent} from "./progress-bar-properties/progress-bar-properties.component";
import {RadioPropertiesComponent} from "./radio-properties/radio-properties.component";
import {SameLinePropertiesComponent} from "./same-line-properties/same-line-properties.component";
import {SelectablePropertiesComponent} from "./selectable-properties/selectable-properties.component";
import {SliderPropertiesComponent} from "./slider-properties/slider-properties.component";
import {TabBarPropertiesComponent} from "./tab-bar-properties/tab-bar-properties.component";
import {TabItemPropertiesComponent} from "./tab-item-properties/tab-item-properties.component";
import {TablePropertiesComponent} from "./table-properties/table-properties.component";
import {TableRowPropertiesComponent} from "./table-row-properties/table-row-properties.component";
import {TextPropertiesComponent} from "./text-properties/text-properties.component";
import {TreeNodePropertiesComponent} from "./tree-node-properties/tree-node-properties.component";
import {VerticalSliderPropertiesComponent} from "./vertical-slider-properties/vertical-slider-properties.component";
import {WindowPropertiesComponent} from "./window-properties/window-properties.component";

interface WidgetInfo {
  warning?: "warning" | "fallback";
  tooltip: string;
}

@Component({
  selector: "fig-properties",
  imports: [
    AsyncPipe,
    MatIcon,
    MatTooltip,
    TextPropertiesComponent,
    PlotPropertiesComponent,
    MenuPropertiesComponent,
    ComboPropertiesComponent,
    LabelPropertiesComponent,
    RadioPropertiesComponent,
    DummyPropertiesComponent,
    ModalPropertiesComponent,
    PopupPropertiesComponent,
    TablePropertiesComponent,
    ButtonPropertiesComponent,
    WindowPropertiesComponent,
    TabBarPropertiesComponent,
    SliderPropertiesComponent,
    TabItemPropertiesComponent,
    ListboxPropertiesComponent,
    CheckboxPropertiesComponent,
    SameLinePropertiesComponent,
    TreeNodePropertiesComponent,
    MenuItemPropertiesComponent,
    TableRowPropertiesComponent,
    InputTextPropertiesComponent,
    SelectablePropertiesComponent,
    ProgressBarPropertiesComponent,
    InputNumberPropertiesComponent,
    ChildWindowPropertiesComponent,
    InputTextareaPropertiesComponent,
    InputColorEditPropertiesComponent,
    VerticalSliderPropertiesComponent,
    CollapsingHeaderPropertiesComponent,
    BlocForPropertiesComponent,
  ],
  templateUrl: "./properties.component.html",
  styleUrl: "./properties.component.css",
})
export class PropertiesComponent {
  private readonly formatterService = inject(FormatterService);

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget?: FIGWidget;
  widgetTitle?: string;
  widgetInfo: Observable<WidgetInfo> = of({tooltip: ""});

  protected readonly FIGWidgetType = FIGWidgetType;

  @Input("widget")
  set _widget(value: FIGWidget | undefined) {
    const prevWidget: FIGWidget | undefined = this.widget;

    this.widget = value;
    this.widgetTitle = value !== undefined ? FIGWidgetFactory.getTitle(value.type) : undefined;
    this.widgetInfo = this.getInfo(value);
    if (prevWidget) {
      prevWidget.isFocused = false;
    }
    if (this.widget) {
      this.widget.isFocused = true;
    }
  }

  private getInfo(widget?: FIGWidget): Observable<WidgetInfo> {
    if (!widget) {
      return of({tooltip: ""});
    }
    return this.formatterService.isSupported(widget.type).pipe(
      combineLatestWith(this.formatterService.useLegacyFallback(widget.type)),
      map(([isSupported, useLegacyFallback]: [boolean, boolean]) => {
        const info: WidgetInfo = {tooltip: ""};

        if (!isSupported) {
          info.warning = "warning";
          info.tooltip = `'${this.formatterService.currentLanguage}' does not support this widget.`;
        }
        if (useLegacyFallback) {
          info.warning = "fallback";
          info.tooltip = `'${this.formatterService.currentLanguage}' fallback to a legacy API for this widget.`;
        }
        return info;
      }),
    );
  }
}
