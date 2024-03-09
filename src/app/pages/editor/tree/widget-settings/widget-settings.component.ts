import {Component, Input} from '@angular/core';
import {ButtonSettingsComponent} from "../button-settings/button-settings.component";
import {TextSettingsComponent} from "../text-settings/text-settings.component";
import {WindowSettingsComponent} from "../window-settings/window-settings.component";
import {FIGWidget, FIGWidgetType} from '../../../../models/widgets/widget';

@Component({
  selector: 'fig-widget-settings',
  standalone: true,
  imports: [
    ButtonSettingsComponent,
    TextSettingsComponent,
    WindowSettingsComponent
  ],
  templateUrl: './widget-settings.component.html',
  styleUrl: './widget-settings.component.css'
})
export class WidgetSettingsComponent {

  @Input()
  widget?: FIGWidget;

  protected readonly FIGWidgetType = FIGWidgetType;

  protected onWidgetUpdated(widget: FIGWidget): void {
    //
  }

}
