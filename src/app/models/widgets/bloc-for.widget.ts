import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";

export interface FIGBlocForOptions {
  readonly size?: number;
}

export class FIGBlocForWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'size', optional: true, default: 10}
  ];

  size: number;

  constructor(options?: FIGBlocForOptions) {
    super(FIGWidgetType.blocFor, true);
    this.size = options?.size ?? 10;
    this._focusOffset.y = 0;
  }

  public get name(): string {
    return `@repeat ${this.size} times`;
  }

  public override draw(): void {
    for (let i: number = 0; i < this.size; i++) {
      for (const child of this.children) {
        child.draw();
        child.listen();
      }
    }
  }
}
