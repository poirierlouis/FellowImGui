import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGLabelOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly value?: string;
}

export class FIGLabelWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'value'},
    {name: 'tooltip', optional: true, default: undefined}
  ];

  label: string = 'Label';
  value: string = 'Value';

  constructor(options?: FIGLabelOptions) {
    super(FIGWidgetType.label, true);
    this.registerString('label', 'Label', options?.label ?? 'Label');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerString('value', 'Value', options?.value ?? 'Value');
  }

  public get name(): string {
    return `${this.value} ${this.label}`;
  }

  public override draw(): void {
    ImGui.LabelText(this.label, this.value);
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }
}
