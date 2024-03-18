import {FIGTextOptions, FIGTextWidget} from "./text.widget";
import {FIGWindowOptions, FIGWindowWidget} from "./window.widget";
import {FIGWidget} from "./widget";
import {FIGSeparatorWidget} from "./separator.widget";
import {FIGButtonOptions, FIGButtonWidget} from "./button.widget";
import {FIGLabelOptions, FIGLabelWidget} from "./label.widget";
import {FIGInputTextOptions, FIGInputTextWidget} from "./input-text.widget";
import {FIGCheckboxOptions, FIGCheckboxWidget} from "./checkbox.widget";
import {FIGRadioOptions, FIGRadioWidget} from "./radio.widget";
import {FIGComboOptions, FIGComboWidget} from "./combo.widget";
import {FIGProgressBarOptions, FIGProgressBarWidget} from "./progress-bar.widget";
import {FIGInputNumberOptions, FIGInputNumberWidget} from "./input-number.widget";
import {FIGInputColorEditOptions, FIGInputColorEditWidget} from "./input-color-edit.widget";

export class FIGWidgetHelper {

  // Layouts
  public static createWindow(options?: FIGWindowOptions,
                             children: FIGWidget[] = []): FIGWindowWidget {
    const widget: FIGWindowWidget = new FIGWindowWidget(options);

    widget.children.push(...children);
    return widget;
  }

  public static createSeparator(): FIGSeparatorWidget {
    return new FIGSeparatorWidget();
  }

  // Basics
  public static createText(options?: FIGTextOptions): FIGTextWidget {
    return new FIGTextWidget(options);
  }

  public static createButton(options?: FIGButtonOptions): FIGButtonWidget {
    return new FIGButtonWidget(options);
  }

  public static createProgressBar(options?: FIGProgressBarOptions): FIGProgressBarWidget {
    return new FIGProgressBarWidget(options);
  }

  // Forms / Inputs
  public static createLabel(options?: FIGLabelOptions): FIGLabelWidget {
    return new FIGLabelWidget(options);
  }

  public static createInputText(options?: FIGInputTextOptions): FIGInputTextWidget {
    return new FIGInputTextWidget(options);
  }

  public static createInputNumber(options?: FIGInputNumberOptions): FIGInputNumberWidget {
    return new FIGInputNumberWidget(options);
  }

  public static createInputColorEdit(options?: FIGInputColorEditOptions): FIGInputColorEditWidget {
    return new FIGInputColorEditWidget(options);
  }

  public static createCheckbox(options?: FIGCheckboxOptions): FIGCheckboxWidget {
    return new FIGCheckboxWidget(options);
  }

  public static createRadio(options?: FIGRadioOptions): FIGRadioWidget {
    return new FIGRadioWidget(options);
  }

  public static createCombo(options?: FIGComboOptions): FIGComboWidget {
    return new FIGComboWidget(options);
  }

}
