import {FIGContainer} from "./widgets/container";
import {FIGWidget} from "./widgets/widget";

export class FIGDocument {

  readonly root: FIGContainer[] = [];

  public link(): void {
    this.root.forEach((container) => container.link());
  }

  public moveWidget(dragWidget: FIGWidget, dropWidget: FIGWidget): boolean {
    if (dragWidget.uuid === dropWidget.uuid) {
      console.log(`<move-widget no-move />`);
      return false;
    }
    const dragParent: FIGContainer | undefined = dragWidget.parent;
    const dropParent: FIGContainer | undefined = dropWidget.parent;

    if (!dragWidget.canBeChild && dropParent) {
      console.log(`<move-widget cannot-be-child />`);
      return false;
    }
    if (dragWidget.canBeChild && dropParent === undefined) {
      console.log(`<move-widget need-parent />`);
      return false;
    }
    if (dragParent === undefined && dropParent === undefined) {
      console.log(`<move-widget same-root />`);
      return false;
    }
    if (dragParent!.uuid === dropParent!.uuid) {
      const dropIndex: number = dropParent!.findIndex(dropWidget);

      dragParent!.remove(dragWidget);
      dropParent!.insert(dragWidget, dropIndex);
      dragWidget.parent = dropParent;
      console.log(`<move-widget same-parent drop="${dropIndex}" />`);
      return true;
    }
    console.log(`<move-widget drag="${dragWidget?.uuid}" drop="${dropWidget?.uuid}" />`);
    console.log(`<move-widget drag-parent="${dragParent?.uuid}" drop-parent="${dropParent?.uuid}" />`);
    return false;
  }

  public removeWidget(widget: FIGWidget): boolean {
    for (let i = 0; i < this.root.length; i++) {
      const container: FIGContainer = this.root[i];

      if (container.uuid === widget.uuid) {
        this.root.splice(i, 1);
        return true;
      } else if (container.remove(widget)) {
        return true;
      }
    }
    return false;
  }

}
