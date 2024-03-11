import {FIGContainer} from "./widgets/container";
import {FIGWidget} from "./widgets/widget";

export class FIGDocument {

  readonly root: FIGContainer[] = [];

  public link(): void {
    this.root.forEach((container) => container.link());
  }

  public createWidget(dragWidget: FIGWidget, dropWidget?: FIGWidget): boolean {
    let dropParent: FIGContainer | undefined = dropWidget?.parent;

    if (!dragWidget.needParent && dropParent) {
      return false;
    }
    if (dragWidget.needParent && dropParent === undefined && !(dropWidget instanceof FIGContainer)) {
      dropParent = this.root[this.root.length - 1];
      dropParent.children.push(dragWidget);
      dragWidget.parent = dropParent;
      return true;
    }
    if (dragWidget instanceof FIGContainer && dropParent === undefined) {
      const dropIndex: number = this.root.findIndex((container) => container.uuid === dropWidget?.uuid);

      if (dropIndex === -1) {
        this.root.push(dragWidget as FIGContainer);
      } else {
        this.insert(dragWidget as FIGContainer, dropIndex);
      }
      return true;
    }
    if (!dropWidget) {
      console.log(`<create-widget drop-error />`);
      return false;
    }
    if (dropParent === undefined && dropWidget instanceof FIGContainer) {
      dropParent = dropWidget;
    }
    const dropParentIndex: number = this.findIndex(dropParent!);

    if (dropWidget instanceof FIGContainer) {
      if (dropParentIndex - 1 < 0) {
        return false;
      }
      dropParent = this.root[dropParentIndex - 1];
      dropParent.children.push(dragWidget);
      dragWidget.parent = dropParent;
      return true;
    }
    let dropIndex: number = dropParent!.findIndex(dropWidget);

    dropParent!.insert(dragWidget, dropIndex);
    dragWidget.parent = dropParent;
    return true;
  }

  public moveWidget(dragWidget: FIGWidget, dropWidget: FIGWidget): boolean {
    if (dragWidget.uuid === dropWidget.uuid) {
      return false;
    }
    const dragParent: FIGContainer | undefined = dragWidget.parent;
    let dropParent: FIGContainer | undefined = dropWidget.parent;

    if (!dragWidget.needParent && dropParent) {
      return false;
    }
    if (dragWidget.needParent && dropParent === undefined && !(dropWidget instanceof FIGContainer)) {
      return false;
    }
    if (dragParent === undefined && dropParent === undefined) {
      const dropIndex: number = this.root.findIndex((container) => container.uuid === dropWidget.uuid);

      this.remove(dragWidget as FIGContainer);
      this.insert(dragWidget as FIGContainer, dropIndex);
      return true;
    }
    if (dropParent === undefined && dropWidget instanceof FIGContainer) {
      dropParent = dropWidget;
    }
    if (dragParent === undefined && dropParent === undefined) {
      console.log(`<move-widget parent-error />`);
      return false;
    }
    if (dragParent!.uuid !== dropParent!.uuid || dropWidget.uuid === dropParent!.uuid) {
      const dragParentIndex: number = this.findIndex(dragParent!);
      const dropParentIndex: number = this.findIndex(dropParent!);
      const delta: number = dropParentIndex - dragParentIndex;
      let dropIndex: number = dropParent!.findIndex(dropWidget);

      if (delta > 0) {
        if (dropWidget instanceof FIGContainer) {
          dropIndex = 0;
        } else {
          dropIndex++;
        }
        dragParent!.remove(dragWidget);
        dropParent!.insert(dragWidget, dropIndex);
      } else if (dropWidget instanceof FIGContainer) {
        if (dropParentIndex - 1 < 0) {
          return false;
        }
        dropParent = this.root[dropParentIndex - 1];
        dragParent!.remove(dragWidget);
        dropParent.children.push(dragWidget);
      } else {
        dragParent!.remove(dragWidget);
        dropParent!.insert(dragWidget, dropIndex);
      }
      dragWidget.parent = dropParent;
      return true;
    }
    const dropIndex = dropParent!.findIndex(dropWidget);

    dragParent!.remove(dragWidget);
    dropParent!.insert(dragWidget, dropIndex);
    dragWidget.parent = dropParent;
    return true;
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

  private findIndex(container: FIGContainer): number {
    return this.root.findIndex((item) => item.uuid === container.uuid);
  }

  private insert(container: FIGContainer, index: number): void {
    this.root.splice(index, 0, container);
  }

  private remove(container: FIGContainer): void {
    const index: number = this.findIndex(container);

    if (index === -1) {
      return;
    }
    this.root.splice(index, 1);
  }

}
