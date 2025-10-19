import {FIGWidgetType} from "./widget";
import {FIGTooltipOption, FIGWithTooltip} from "./with-tooltip.widget";
import {Vector2} from "../math";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {EnumOption} from "../fields/enum.field";

export enum FIGDir {
  left,
  right,
  up,
  down,
  none = -1
}

export const FIGDirOptions: EnumOption[] = [
  {value: FIGDir.none, label: 'None'},
  {value: FIGDir.left, label: 'Left'},
  {value: FIGDir.right, label: 'Right'},
  {value: FIGDir.up, label: 'Up'},
  {value: FIGDir.down, label: 'Down'},
];

export interface FIGButtonOptions extends FIGTooltipOption {
  readonly label?: string;
  readonly isFill?: boolean;
  readonly isSmall?: boolean;
  readonly arrow?: FIGDir;
}

export class FIGButtonWidget extends FIGWithTooltip {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'label'},
    {name: 'isFill', optional: true, default: false},
    {name: 'isSmall', optional: true, default: false},
    {name: 'arrow', optional: true, default: FIGDir.none},
    {name: 'tooltip', optional: true, default: undefined},
  ];

  label: string = 'Button';
  isFill: boolean = false;
  isSmall: boolean = false;
  arrow: FIGDir = FIGDir.none;

  constructor(options?: FIGButtonOptions) {
    super(FIGWidgetType.button, true);
    this.registerString('label', 'Label', options?.label ?? 'Button');
    this.registerString('tooltip', 'Tooltip', options?.tooltip, true);
    this.registerBool('isFill', 'Fill', options?.isFill, true, false);
    this.registerBool('isSmall', 'Small', options?.isSmall, true, false);
    this.registerEnum('arrow', 'Arrow', FIGDirOptions, options?.arrow, true, FIGDir.none);
  }

  public get name(): string {
    return this.label;
  }

  public override draw(): void {
    if (this.isSmall) {
      ImGui.SmallButton(this.label);
    } else if (this.arrow !== FIGDir.none) {
      ImGui.ArrowButton(this.label, this.arrow);
    } else {
      const size: Vector2 | undefined = (this.isFill) ? {x: -1.0, y: 0.0} : undefined;

      ImGui.Button(this.label, size);
    }
    this.drawTooltip();
    this.drawFocus();
    this.scrollTo();
  }

}
