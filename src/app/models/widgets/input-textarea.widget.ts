import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGInputTextFlags} from "./input-text.widget";
import {Vector2} from "../math";

export interface FIGInputTextareaOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
  readonly linesSize?: number;
  readonly bufferSize?: number;
  readonly flags?: FIGInputTextFlags;
}

export class FIGInputTextareaWidget extends FIGWithTooltip {

  label: string;
  value: string;
  linesSize: number;
  bufferSize: number;
  flags: number;

  constructor(options?: FIGInputTextareaOptions) {
    super(FIGWidgetType.inputTextarea, true);
    this.label = options?.label ?? '##InputTextMultiline';
    this.value = options?.value ?? '';
    this.tooltip = options?.tooltip;
    this.linesSize = options?.linesSize ?? 6;
    this.bufferSize = options?.bufferSize ?? 256;
    this.bufferSize = Math.max(this.value.length, this.bufferSize);
    this.flags = options?.flags ?? 0;
  }

  public get name(): string {
    return this.label.slice(2);
  }

  public override draw(): void {
    const access = (_ = this.value) => this.value = _;
    const prevValue = this.value;
    const size: Vector2 = {x: -1, y: ImGui.GetTextLineHeight() * this.linesSize};

    ImGui.InputTextMultiline(this.label, access, this.bufferSize, size, this.flags);
    super.drawTooltip();
    super.drawFocus();
    if (prevValue !== this.value) {
      this.bufferSize = Math.max(this.value.length, this.bufferSize);
      this.updateSubject.next();
    }
  }
}