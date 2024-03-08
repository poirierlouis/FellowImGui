import {FIGWidget} from "./widget";

export abstract class FIGContainer extends FIGWidget {
  readonly children: FIGWidget[] = [];
}
