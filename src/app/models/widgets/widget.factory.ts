import {FIGWidget, FIGWidgetType} from "./widget";
import {FIGWindowWidget} from "./window.widget";
import {FIGTextWidget} from "./text.widget";
import {FIGButtonWidget} from "./button.widget";

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
  ];

  public static createWidget(type: FIGWidgetType): FIGWidget | undefined {
    const builder: WidgetBuilder | undefined = this.builders.find((item) => item.type === type);

    if (!builder) {
      return undefined;
    }
    return builder.build(++WidgetFactory.id);
  }

}
