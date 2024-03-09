import {FIGWidget} from "./widget";

export abstract class FIGContainer extends FIGWidget {
  children: FIGWidget[] = [];

  public override trackBy(): any {
    return this.children.map((child) => child.trackBy());
  }

  public remove(widget: FIGWidget): boolean {
    const index: number = this.children.findIndex((child) => child.uuid === widget.uuid);

    if (index === -1) {
      return false;
    }
    this.children.splice(index, 1);
    return true;
  }
}
