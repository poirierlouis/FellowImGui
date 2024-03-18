import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";

export interface FIGInputTextOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
  readonly hint?: string;
  readonly bufferSize?: number;
}

export class FIGInputTextWidget extends FIGWithTooltip {
  label: string;
  value: string;
  hint?: string;
  bufferSize: number;

  constructor(options?: FIGInputTextOptions) {
    super(FIGWidgetType.inputText, true);
    this.label = options?.label ?? 'Text';
    this.value = options?.value ?? '';
    this.hint = options?.hint;
    this.tooltip = options?.tooltip;
    this.bufferSize = options?.bufferSize ?? 256;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const access = (_ = this.value) => this.value = _;
    const prevValue = this.value;

    if (!this.hint) {
      ImGui.InputText(this.label, access, this.bufferSize);
    } else {
      ImGui.InputTextWithHint(this.label, this.hint, access, this.bufferSize);
    }
    super.drawTooltip();
    super.drawFocus();
    if (prevValue !== this.value) {
      this.updateSubject.next();
    }
  }
}
