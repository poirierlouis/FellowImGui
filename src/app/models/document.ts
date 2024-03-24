import {FIGContainer} from "./widgets/container";
import {FIGWidget, FIGWidgetType} from "./widgets/widget";
import {FIGDropDirection} from "../directives/drop.directive";
import {FIGWidgetFactory} from "./widgets/widget.factory";

export class FIGDocument {

  readonly root: FIGContainer[] = [];

  public link(): void {
    this.root.forEach((container) => container.link());
  }

  public findByUuid(uuid: string): FIGWidget | undefined {
    for (const container of this.root) {
      if (container.uuid === uuid) {
        return container;
      }
      const widget: FIGWidget | undefined = container.findByUuid(uuid);

      if (widget) {
        return widget;
      }
    }
    return undefined;
  }

  public createWidget(type: FIGWidgetType, drop: FIGWidget | undefined, direction: FIGDropDirection): boolean {
    const drag: FIGWidget | undefined = FIGWidgetFactory.createWidget(type);
    let parent: FIGContainer | undefined = drop?.parent;

    if (!drag) {
      return false;
    }
    // Prevent inserting child-like widget in root.
    if (!drop && (drag.needParent || !(drag instanceof FIGContainer))) {
      return false;
    }
    // Insert window-like widgets at the end of tree.
    if (!drop) {
      this.root.push(drag as FIGContainer);
      drag.parent = undefined;
      drag.onCreated();
      return true;
    }
    // Prevent window-like widgets within containers.
    if (!drag.needParent && (parent || direction === 'insert')) {
      return false;
    }
    // Insert window-like widgets before/after a container.
    if (!drag.needParent && drag instanceof FIGContainer && drop instanceof FIGContainer) {
      let index: number = this.findIndex(drop);

      if (direction === 'after') {
        index++;
      }
      this.insert(drag, index);
      drag.parent = undefined;
      drag.onCreated();
      return true;
    }
    // Append widget at the end of drop container.
    if (drag.needParent && drop instanceof FIGContainer && direction === 'insert' && drop.isChildAccepted(drag.type)) {
      drop.children.push(drag);
      drag.parent = drop;
      drag.onCreated();
      return true;
    }
    // Insert widget before/after a widget.
    if (drag.needParent && parent && parent.isChildAccepted(drag.type)) {
      let index: number = parent.findIndex(drop);

      if (direction === 'after') {
        index++;
      }
      parent.insert(drag, index);
      drag.parent = parent;
      drag.onCreated();
      return true;
    }
    return false;
  }

  public moveWidget(drag: FIGWidget, drop: FIGWidget | undefined, direction: FIGDropDirection): boolean {
    let parent: FIGContainer | undefined = drop?.parent;

    // Prevent moving child-like widget at the end of tree.
    if (!drop && (drag.needParent || !(drag instanceof FIGContainer))) {
      return false;
    }
    // Move window-like widgets at the end of tree.
    if (!drop) {
      this.remove(drag as FIGContainer);
      this.root.push(drag as FIGContainer);
      drag.parent = undefined;
      drag.onCreated();
      return true;
    }
    // Prevent moving widget on itself.
    if (drag.uuid === drop.uuid) {
      return false;
    }
    // Prevent window-like widgets within containers.
    if (!drag.needParent && (parent || direction === 'insert')) {
      return false;
    }
    // Move window-like widgets before/after a container.
    if (!drag.needParent && drag instanceof FIGContainer && drop instanceof FIGContainer) {
      let index: number = this.findIndex(drop);

      if (direction === 'after') {
        index++;
      }
      this.remove(drag);
      this.insert(drag, index);
      drag.parent = undefined;
      drag.onMoved();
      return true;
    }
    // Prevent moving widget in itself.
    if (drag.needParent && drag.uuid === parent?.uuid) {
      return false;
    }
    // Move widget at the end of drop container.
    if (drag.needParent && drop instanceof FIGContainer && direction === 'insert' && drop.isChildAccepted(drag.type)) {
      drag.parent?.remove(drag);
      drop.children.push(drag);
      drag.parent = drop;
      drag.onMoved();
      return true;
    }
    // Move widget elsewhere within a container.
    if (drag.needParent && direction !== 'insert' && parent && parent.isChildAccepted(drag.type)) {
      drag.parent?.remove(drag);
      let index: number = parent.findIndex(drop);

      if (direction === 'after') {
        index++;
      }
      parent.insert(drag, index);
      drag.parent = parent;
      drag.onMoved();
      return true;
    }
    return false;
  }

  public removeWidget(widget: FIGWidget): boolean {
    for (let i: number = 0; i < this.root.length; i++) {
      const container: FIGContainer = this.root[i];

      if (container.uuid === widget.uuid) {
        this.root.splice(i, 1);
        widget.onDeleted();
        return true;
      } else if (container.remove(widget)) {
        widget.onDeleted();
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
