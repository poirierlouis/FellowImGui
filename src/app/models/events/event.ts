import {FIGWidget} from "../widgets/widget";

export enum FIGEventType {
  click
}

export interface FIGEvent {
  readonly type: FIGEventType;
  readonly target: FIGWidget;
}
