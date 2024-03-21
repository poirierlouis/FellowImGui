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

  public findByUuid(uuid: string): FIGWidget | undefined {
    for (const child of this.children) {
      if (child.uuid === uuid) {
        return child;
      }
      let widget: FIGWidget | undefined;

      if (child instanceof FIGContainer) {
        widget = child.findByUuid(uuid);
      }
      if (widget) {
        return widget;
      }
    }
    return undefined;
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

  public remove(widget: FIGWidget): boolean {
    for (let i: number = 0; i < this.children.length; i++) {
      const child: FIGWidget = this.children[i];

      if (child.uuid === widget.uuid) {
        this.children.splice(i, 1);
        return true;
      } else if (child instanceof FIGContainer && child.remove(widget)) {
        return true;
      }
    }
    return false;
  }
}
