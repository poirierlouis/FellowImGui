import {FIGTextWidget} from "./text.widget";
import {Size} from "../math";
import {FIGWindowWidget} from "./window.widget";
import {FIGWidget} from "./widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGButtonWidget, FIGDir} from "./button.widget";
import {FIGLabelWidget} from "./label.widget";
import {FIGInputTextWidget} from "./input-text.widget";
import {FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioWidget} from "./radio.widget";
import {FIGComboWidget} from "./combo.widget";
import {FIGProgressBarWidget} from "./progress-bar.widget";

type FIGTextOptions = Partial<FIGTextWidget>;
type FIGButtonOptions = Partial<FIGButtonWidget>;
type FIGProgressBarOptions = Partial<FIGProgressBarWidget>;

type FIGInputTextOptions = Partial<FIGInputTextWidget>;
type FIGRadioOptions = Partial<FIGRadioWidget>;
type FIGComboOptions = Partial<FIGComboWidget>;

export class FIGWidgetHelper {

  // Layouts
  public static createWindow(text: string,
                             size: Size = {width: 320, height: 240},
                             children: FIGWidget[] = []): FIGWindowWidget {
    const widget: FIGWindowWidget = new FIGWindowWidget(text, size);

    widget.children.push(...children);
    return widget;
  }

  public static createSeparator(): FIGSeparatorWidget {
    return new FIGSeparatorWidget();
  }

  // Basics
  public static createText(text: string,
                           options?: FIGTextOptions): FIGTextWidget {
    const widget: FIGTextWidget = new FIGTextWidget();

    widget.text = text;
    widget.color = options?.color;
    widget.isDisabled = options?.isDisabled ?? false;
    widget.isWrapped = options?.isWrapped ?? false;
    widget.hasBullet = options?.hasBullet ?? false;
    widget.tooltip = options?.tooltip;
    return widget;
  }

  public static createButton(text: string,
                             options?: FIGButtonOptions): FIGButtonWidget {
    const widget: FIGButtonWidget = new FIGButtonWidget();

    widget.text = text;
    widget.isFill = options?.isFill ?? false;
    widget.isSmall = options?.isSmall ?? false;
    widget.arrow = options?.arrow ?? FIGDir.none;
    widget.tooltip = options?.tooltip;
    return widget;
  }

  public static createProgressBar(value: number,
                                  options?: FIGProgressBarOptions): FIGProgressBarWidget {
    const widget: FIGProgressBarWidget = new FIGProgressBarWidget();

    widget.value = value;
    widget.label = options?.label;
    widget.isFill = options?.isFill ?? false;
    widget.tooltip = options?.tooltip;
    return widget;
  }

  // Forms / Inputs
  public static createLabel(label: string, value: string, tooltip?: string): FIGLabelWidget {
    return new FIGLabelWidget(label, value, tooltip);
  }

  public static createInputText(text: string, options?: FIGInputTextOptions): FIGInputTextWidget {
    const widget: FIGInputTextWidget = new FIGInputTextWidget(text);

    widget.hint = options?.hint;
    widget.value = options?.value ?? '';
    widget.bufferSize = options?.bufferSize ?? 256;
    widget.tooltip = options?.tooltip;
    return widget;
  }

  public static createCheckbox(text: string, isChecked: boolean = false, tooltip?: string): FIGCheckboxWidget {
    const widget: FIGCheckboxWidget = new FIGCheckboxWidget(text);

    widget.isChecked = isChecked;
    widget.tooltip = tooltip;
    return widget;
  }

  public static createRadio(text: string, options?: FIGRadioOptions): FIGRadioWidget {
    const widget: FIGRadioWidget = new FIGRadioWidget(text);

    widget.text = text;
    widget.groupId = options?.groupId ?? 'RadioGroup';
    widget.index = options?.index ?? 0;
    widget.tooltip = options?.tooltip;
    return widget;
  }

  public static createCombo(label: string, options?: FIGComboOptions): FIGComboWidget {
    const widget: FIGComboWidget = new FIGComboWidget(label);

    widget.items.push(...(options?.items ?? []));
    widget.selectedIndex = options?.selectedIndex ?? 0;
    widget.tooltip = options?.tooltip;
    return widget;
  }

}
