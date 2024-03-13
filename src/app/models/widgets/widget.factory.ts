import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWindowWidget} from "./window.widget";
import {FIGTextWidget} from "./text.widget";
import {FIGButtonWidget} from "./button.widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioWidget} from "./radio.widget";
import {FIGLabelWidget} from "./label.widget";

interface WidgetBuilder {
  readonly type: FIGWidgetType;
  readonly build: (id: number) => FIGWidget;
}

export class WidgetFactory {

  private static id: number = 0;

  private static builders: WidgetBuilder[] = [
    {type: FIGWidgetType.window, build: (id: number) => new FIGWindowWidget(`Window ${id}`)},
    {type: FIGWidgetType.text, build: (id: number) => new FIGTextWidget(`Text ${id}`)},
    {type: FIGWidgetType.button, build: (id: number) => new FIGButtonWidget(`Button ${id}`)},
    {type: FIGWidgetType.checkbox, build: (id: number) => new FIGCheckboxWidget(`Checkbox ${id}`)},
    {type: FIGWidgetType.radio, build: (id: number) => new FIGRadioWidget(`Radio ${id}`)},
    {type: FIGWidgetType.label, build: (id: number) => new FIGLabelWidget(`Label ${id}`, `Value ${id}`)},
    {type: FIGWidgetType.separator, build: (id: number) => new FIGSeparatorWidget()},
  ];

  public static createWidget(type: FIGWidgetType): FIGWidget | undefined {
    const builder: WidgetBuilder | undefined = this.builders.find((item) => item.type === type);

    if (!builder) {
      return undefined;
    }
    return builder.build(++WidgetFactory.id);
  }

}
