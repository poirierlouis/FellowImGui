import {FIGContainer} from "./widgets/container";
import {FIGWidget} from "./widgets/widget";
import {FIGDropDirection} from "../directives/drop.directive";
import {BehaviorSubject, bufferTime, filter, map, Observable} from "rxjs";
import {FIGEvent} from "./events/event";
import {FIGConfig} from "./document-config";
import {FIGFont, formatImGuiFontName} from "./document-fonts";

export class FIGDocument {

  // NOTE: sync version number with FIGBaseDocumentParser.
  readonly version: string = '0.0.0';
  readonly root: FIGContainer[] = [];

  config: FIGConfig = {
    font: undefined,
    embeddedFonts: [],
    sizes: undefined,
    theme: 'dark',
    colors: undefined
  };

  private readonly eventSubject: BehaviorSubject<FIGEvent | undefined> = new BehaviorSubject<FIGEvent | undefined>(undefined);
  private readonly event$: Observable<FIGEvent | undefined> = this.eventSubject.asObservable();

  public addFont(font: FIGFont): void {
    const duplicate: FIGFont | undefined = this.findFont(font);

    if (duplicate) {
      return;
    }
    this.config.embeddedFonts.push(font);
  }

  public removeFont(font: FIGFont): void {
    const index: number = this.config.embeddedFonts.findIndex((item) => formatImGuiFontName(item) === formatImGuiFontName(font));

    if (index === -1) {
      return;
    }
    this.config.embeddedFonts.splice(index, 1);
  }

  public findFontByName(imguiFontName: string): FIGFont | undefined {
    return this.config.embeddedFonts.find((item: FIGFont) => formatImGuiFontName(item) === imguiFontName);
  }

  public link(): void {
    this.root.forEach((container) => container.link(this.eventSubject));
  }

  public listen(): Observable<FIGEvent[]> {
    return this.event$.pipe(
      bufferTime(100),
      map((events: (FIGEvent | undefined)[]) => {
        return events.filter((event) => !!event) as FIGEvent[];
      }),
      filter((events: FIGEvent[]) => events.length > 0)
    );
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

  public insertWidget(drag: FIGWidget | undefined, drop: FIGWidget | undefined, direction: FIGDropDirection): boolean {
    const parent: FIGContainer | undefined = drop?.parent;

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
      drag.link(this.eventSubject);
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
      drag.link(this.eventSubject);
      drag.onCreated();
      return true;
    }
    // Append widget at the end of drop container.
    if (drag.needParent && drop instanceof FIGContainer && direction === 'insert' && drop.isChildAccepted(drag.type)) {
      drop.children.push(drag);
      drag.link(this.eventSubject, drop);
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
      drag.link(this.eventSubject, parent);
      drag.onCreated();
      return true;
    }
    return false;
  }

  public moveWidget(drag: FIGWidget, drop: FIGWidget | undefined, direction: FIGDropDirection): boolean {
    const parent: FIGContainer | undefined = drop?.parent;

    // Prevent moving child-like widget at the end of tree.
    if (!drop && (drag.needParent || !(drag instanceof FIGContainer))) {
      return false;
    }
    // Move window-like widgets at the end of tree.
    if (!drop) {
      this.remove(drag as FIGContainer);
      this.root.push(drag as FIGContainer);
      drag.parent = undefined;
      drag.onMoved();
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

  private findFont(font: FIGFont): FIGFont | undefined {
    return this.config.embeddedFonts.find((item: FIGFont) => {
      return item.name === font.name && item.size === font.size;
    });
  }

}
