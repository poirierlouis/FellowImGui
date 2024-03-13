import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWindowWidget} from "./window.widget";
import {FIGTextWidget} from "./text.widget";
import {FIGButtonWidget} from "./button.widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioWidget} from "./radio.widget";
import {FIGLabelWidget} from "./label.widget";
import {FIGComboWidget} from "./combo.widget";

export interface FIGWidgetBuilder {
  readonly type: FIGWidgetType;
  readonly title: string;
  readonly build: (id: number) => FIGWidget;
}

export class FIGWidgetFactory {

  public static readonly builders: FIGWidgetBuilder[] = [
    {type: FIGWidgetType.window, title: 'Window', build: (id: number) => new FIGWindowWidget(`Window ${id}`)},
    {type: FIGWidgetType.text, title: 'Text', build: () => new FIGTextWidget('Text')},
    {type: FIGWidgetType.button, title: 'Button', build: () => new FIGButtonWidget('Button')},
    {type: FIGWidgetType.checkbox, title: 'Checkbox', build: (id: number) => new FIGCheckboxWidget(`Checkbox ${id}`)},
    {type: FIGWidgetType.radio, title: 'Radio', build: (id: number) => new FIGRadioWidget(`Radio ${id}`)},
    {
      type: FIGWidgetType.label,
      title: 'Label',
      build: () => new FIGLabelWidget('Label', 'Value')
    },
    {type: FIGWidgetType.combo, title: 'Combo', build: (id: number) => new FIGComboWidget(`Combo ${id}`)},
    {type: FIGWidgetType.separator, title: 'Separator', build: (id: number) => new FIGSeparatorWidget()},
  ];
  public static readonly icons: string[] = FIGWidgetFactory.builders.map((builder) => FIGWidgetType[builder.type]);

  private static id: number = 0;

  public static createWidget(type: FIGWidgetType): FIGWidget | undefined {
    const builder: FIGWidgetBuilder | undefined = this.builders.find((item) => item.type === type);

    if (!builder) {
      return undefined;
    }
    return builder.build(++FIGWidgetFactory.id);
  }

}
