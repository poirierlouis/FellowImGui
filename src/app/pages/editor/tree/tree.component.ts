import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from "@angular/material/tree";
import {FIGContainer} from "../../../models/widgets/container";
import {FIGWidget, FIGWidgetType} from "../../../models/widgets/widget";
import {DismissibleDirective} from "../../../directives/dismissible.directive";
import {FIGDocument} from "../../../models/document";
import {SelectionModel} from "@angular/cdk/collections";
import {DragDirective} from "../../../directives/drag.directive";
import {DropDirective, FIGDropEvent} from "../../../directives/drop.directive";
import {DragHandleDirective} from "../../../directives/drag-handle.directive";
import {FormatterService} from "../../../services/formatter.service";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FIGAction, FIGActionFactory} from "../../../models/actions/action";
import {FIGWidgetFactory} from "../../../models/widgets/widget.factory";
import {AsyncPipe} from "@angular/common";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'fig-tree',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIcon,
    MatDivider,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle,
    MatNestedTreeNode,
    MatTreeNodePadding,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatMenuContent,
    DragDirective,
    DropDirective,
    DragHandleDirective,
    DismissibleDirective,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  @ViewChild(MatTree)
  tree!: MatTree<FIGWidget>;

  @ViewChildren(MatTreeNode, {read: ElementRef})
  nodes!: QueryList<ElementRef>;

  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;

  @Input()
  document!: FIGDocument;

  @Output()
  action: EventEmitter<FIGAction> = new EventEmitter<FIGAction>();

  contextMenuPosition: { x: string, y: string } = {x: '0', y: '0'};

  treeSelection: SelectionModel<string> = new SelectionModel(true);
  dataSource: FIGWidget[] = [];
  selectedWidget?: FIGWidget;

  constructor(private readonly formatterService: FormatterService,
              private readonly toast: MatSnackBar) {
  }

  @Input('document')
  set _document(value: FIGDocument) {
    this.document = value;
    this.dataSource = this.document.root;
  }

  childrenAccessor = (widget: FIGWidget): FIGWidget[] => {
    return widget instanceof FIGContainer ? widget.children : [];
  };
  isExpandable = (widget: FIGWidget) => this.isContainer(widget) && widget.children.length > 0;
  isContainer = (widget: FIGWidget) => widget instanceof FIGContainer;
  trackBy = (_: number, widget: FIGWidget) => widget.uuid; //.trackBy();

  isSupported = (widget: FIGWidget) => this.formatterService.isSupported(widget.type);
  useLegacyFallback = (widget: FIGWidget) => this.formatterService.useLegacyFallback(widget.type);
  getIcon = (type: FIGWidgetType) => FIGWidgetType[type];

  public update(): void {
    this.dataSource = [...this.document.root];
    //this.updateTree();
  }

  public openWidget(widget: FIGWidget): void {
    const widgets: FIGWidget[] = this.traverseWidgets(widget);

    for (const widget of widgets) {
      if (!this.tree.isExpanded(widget)) {
        this.tree.expand(widget);
      }
    }
    if (widgets.length > 0) {
      this.treeSelection.select(widgets[widgets.length - 1].uuid);
    }
    if (!this.selectWidget(widget)) {
      return;
    }
    setTimeout(() => {
      const node: ElementRef | undefined = this.nodes.find((node) => node.nativeElement.dataset['uuid'] === widget.uuid);

      if (!node) {
        return;
      }
      const $node: HTMLElement = node.nativeElement;

      $node.scrollIntoView({block: 'center'});
    });
  }

  public removeWidget(widget: FIGWidget): void {
    if (this.selectedWidget?.uuid === widget.uuid) {
      this.selectedWidget = undefined;
      this.action.emit(FIGActionFactory.select());
    }
    if (this.document.removeWidget(widget)) {
      this.action.emit(FIGActionFactory.remove(widget));
      this.update();
    }
  }

  public duplicateWidget(widget: FIGWidget): void {
    const clone: FIGWidget | undefined = FIGWidgetFactory.clone(widget);
    const needUpdate: boolean = this.document.insertWidget(clone, widget, 'after');

    if (!needUpdate) {
      console.error('Failed to duplicate this widget.');
      return;
    }
    this.update();
    this.action.emit(FIGActionFactory.duplicate(widget));
  }

  public async generateCode(widget: FIGWidget): Promise<void> {
    if (!this.isSupported(widget)) {
      this.toast.open(`'${this.formatterService.currentLanguage}' does not support this widget.`);
      return;
    }
    let code: string | undefined = this.formatterService.formatWidget(widget);

    if (!code) {
      // TODO: show toast "You must select a language to format to."
      return;
    }
    code = code.trim();
    await navigator.clipboard.writeText(code);
    this.toast.open(`'${this.formatterService.currentLanguage}' code generated in clipboard.`);
  }

  protected selectWidget(widget: FIGWidget): boolean {
    if (widget instanceof FIGContainer) {
      this.treeSelection.toggle(widget.uuid);
      if (this.tree.isExpanded(widget)) {
        this.tree.collapse(widget);
      } else {
        this.tree.expand(widget);
      }
    }
    let isSelected: boolean = false;

    if (this.selectedWidget?.uuid === widget.uuid && !(this.selectedWidget instanceof FIGContainer)) {
      this.selectedWidget = undefined;
    } else {
      this.selectedWidget = widget;
      isSelected = true;
    }
    this.action.emit(FIGActionFactory.select(this.selectedWidget));
    return isSelected;
  }

  protected dropWidget(event: FIGDropEvent): void {
    const type: FIGWidgetType | undefined = FIGWidgetType[event.drag as keyof typeof FIGWidgetType];
    const drag: FIGWidget | undefined = (!event.drag) ? undefined : this.document.findByUuid(event.drag);
    const drop: FIGWidget | undefined = (!event.drop) ? undefined : this.document.findByUuid(event.drop);
    let needUpdate: boolean = false;

    if (type !== undefined || event.duplicate) {
      let widget: FIGWidget | undefined;

      if (event.duplicate && drag) {
        widget = FIGWidgetFactory.clone(drag);
      } else if (type !== undefined) {
        widget = FIGWidgetFactory.create(type);
      }
      needUpdate = this.document.insertWidget(widget, drop, event.direction);
    } else if (drag) {
      needUpdate = this.document.moveWidget(drag, drop, event.direction);
    }
    if (needUpdate) {
      this.update();
    }
  }

  protected onContextMenu(event: MouseEvent, widget: FIGWidget): void {
    event.preventDefault();
    this.contextMenuPosition.x = `${event.clientX}px`;
    this.contextMenuPosition.y = `${event.clientY}px`;
    this.trigger.menuData = {'widget': widget};
    this.trigger.openMenu();
  }

  private traverseWidgets(widget: FIGWidget): FIGWidget[] {
    const widgets: FIGWidget[] = [];
    let parent: FIGContainer | undefined = widget.parent;

    while (parent !== undefined) {
      widgets.push(parent);
      parent = parent.parent;
    }
    return widgets.reverse();
  }

  private updateTree(): void {
    for (const uuid of this.treeSelection.selected) {
      const widget = this.document.findByUuid(uuid);

      if (widget) {
        this.tree.expand(widget);
      }
    }
  }
}
