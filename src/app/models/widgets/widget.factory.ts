import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWindowWidget} from "./window.widget";
import {FIGTextWidget} from "./text.widget";
import {FIGButtonWidget} from "./button.widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioWidget} from "./radio.widget";
import {FIGLabelWidget} from "./label.widget";

export interface WidgetBuilder {
  readonly type: FIGWidgetType;
  readonly title: string;
  readonly build: (id: number) => FIGWidget;
}

export class WidgetFactory {

  public static readonly builders: WidgetBuilder[] = [
    {type: FIGWidgetType.window, title: 'Window', build: (id: number) => new FIGWindowWidget(`Window ${id}`)},
    {type: FIGWidgetType.text, title: 'Text', build: (id: number) => new FIGTextWidget(`Text ${id}`)},
    {type: FIGWidgetType.button, title: 'Button', build: (id: number) => new FIGButtonWidget(`Button ${id}`)},
    {type: FIGWidgetType.checkbox, title: 'Checkbox', build: (id: number) => new FIGCheckboxWidget(`Checkbox ${id}`)},
    {type: FIGWidgetType.radio, title: 'Radio', build: (id: number) => new FIGRadioWidget(`Radio ${id}`)},
    {
      type: FIGWidgetType.label,
      title: 'Label',
      build: (id: number) => new FIGLabelWidget(`Label ${id}`, `Value ${id}`)
    },
    {type: FIGWidgetType.separator, title: 'Separator', build: (id: number) => new FIGSeparatorWidget()},
  ];
  public static readonly icons: string[] = WidgetFactory.builders.map((builder) => FIGWidgetType[builder.type]);

  private static id: number = 0;

  public static createWidget(type: FIGWidgetType): FIGWidget | undefined {
    const builder: WidgetBuilder | undefined = this.builders.find((item) => item.type === type);

    if (!builder) {
      return undefined;
    }
    return builder.build(++WidgetFactory.id);
  }

}
