import {FIGWidget} from "../widgets/widget";

export enum FIGActionType {
  select,
  duplicate,
  remove,
}

export interface FIGAction {
  readonly type: FIGActionType;
  readonly widget?: FIGWidget;
}

export class FIGActionFactory {

  public static select(widget?: FIGWidget): FIGAction {
    return {
      type: FIGActionType.select,
      widget: widget
    }
  }

  public static duplicate(widget: FIGWidget): FIGAction {
    return {
      type: FIGActionType.duplicate,
      widget: widget
    }
  }

  public static remove(widget: FIGWidget): FIGAction {
    return {
      type: FIGActionType.remove,
      widget: widget
    }
  }

}
