import {FIGWidget} from "../widgets/widget";

export enum FIGWidgetActionType {
  select,
  duplicate,
  remove,
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

  public static duplicate(widget: FIGWidget): FIGWidgetAction {
    return {
      type: FIGWidgetActionType.duplicate,
      widget: widget
    }
  }

  public static remove(widget: FIGWidget): FIGWidgetAction {
    return {
      type: FIGWidgetActionType.remove,
      widget: widget
    }
  }

}
