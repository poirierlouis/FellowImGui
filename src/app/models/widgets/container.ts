import {FIGWidget} from "./widget";

export abstract class FIGContainer extends FIGWidget {
  readonly children: FIGWidget[] = [];

  public override trackBy(): any {
    return this.children.map((child) => child.trackBy());
  }

  public override link(parent?: FIGContainer) {
    this.parent = parent;
    this.children.forEach((child) => child.link(this));
  }

  public override flatMap(): FIGWidget[] {
    return [this, ...this.children.flatMap((child) => child.flatMap())];
  }

  public findIndex(widget: FIGWidget): number {
    return this.children.findIndex((child) => child.uuid === widget.uuid);
  }

  public filter<T extends FIGWidget>(predicate: (widget: FIGWidget) => boolean): T[] {
    return this.children.filter(predicate) as T[];
  }

  public insert(widget: FIGWidget, index: number): void {
    this.children.splice(index, 0, widget);
  }

  public removeAt(index: number): boolean {
    if (index < 0 || index >= this.children.length) {
      return false;
    }
    this.children.splice(index, 1);
    return true;
  }

  public remove(widget: FIGWidget): boolean {
    const index: number = this.findIndex(widget);

    return this.removeAt(index);
  }
}
