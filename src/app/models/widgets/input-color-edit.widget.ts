import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Color} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGInputColorEditOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly color?: Color;
  readonly withAlpha?: boolean;
}

export class FIGInputColorEditWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'color', type: 'object', innerType: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a'}]},
    {name: 'withAlpha', optional: true, default: false},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  label: string;
  color: Color;
  withAlpha: boolean;

  constructor(options?: FIGInputColorEditOptions) {
    super(FIGWidgetType.inputColorEdit, true);
    this.label = options?.label ?? 'Input Color Edit';
    this.color = options?.color ?? {r: 0.5, g: 0.5, b: 0.5, a: 0.5};
    this.withAlpha = options?.withAlpha ?? false;
    this.tooltip = options?.tooltip;
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    const values: number[] = [this.color.r, this.color.g, this.color.b, this.color.a];
    const prevValues: number[] = [...values];

    if (!this.withAlpha) {
      ImGui.ColorEdit3(this.label, values);
    } else {
      ImGui.ColorEdit4(this.label, values);
    }
    if (this.diffColor(prevValues, values)) {
      this.color.r = values[0];
      this.color.g = values[1];
      this.color.b = values[2];
      this.color.a = values[3];
      this.triggerUpdate();
    }
    super.drawTooltip();
    super.drawFocus();
  }

  private diffColor(prevColor: number[], color: number[]): boolean {
    for (let i = 0; i < 4; i++) {
      if (prevColor[i] !== color[i]) {
        return true;
      }
    }
    return false;
  }
}
