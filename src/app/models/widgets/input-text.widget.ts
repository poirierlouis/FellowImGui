import {FIGWidgetType} from "./widget";
import {FIGWithTooltip} from "./with-tooltip.widget";

export class FIGInputTextWidget extends FIGWithTooltip {
  text: string;
  value: string;
  hint?: string;
  bufferSize: number;

  constructor(text: string = 'Text', hint?: string, value: string = '', tooltip?: string) {
    super(FIGWidgetType.inputText, true);
    this.text = text;
    this.value = value;
    this.hint = hint;
    this.tooltip = tooltip;
    this.bufferSize = 256;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const access = (_ = this.value) => this.value = _;
    const prevValue = this.value;

    if (!this.hint) {
      ImGui.InputText(this.text, access, this.bufferSize);
    } else {
      ImGui.InputTextWithHint(this.text, this.hint, access, this.bufferSize);
    }
    super.drawTooltip();
    super.drawFocus();
    if (prevValue !== this.value) {
      this.updateSubject.next();
    }
  }
}
