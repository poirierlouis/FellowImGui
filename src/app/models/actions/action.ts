import {FIGWidget} from "../widgets/widget";

export enum FIGWidgetActionType {
  select,
}

export interface FIGWidgetAction {
  readonly type: FIGWidgetActionType;
  readonly widget?: FIGWidget;
}

export class FIGWidgetAction {

  public static select(widget?: FIGWidget): FIGWidgetAction {
    return {
      type: FIGWidgetActionType.select,
      widget: widget
    }
  }

}
