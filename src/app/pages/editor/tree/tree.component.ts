import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
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
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatDivider} from "@angular/material/divider";

interface FlatNode {
  expandable: boolean;
  level: number;

  name: string;
  icon: string;
  isContainer: boolean;
  widget: FIGWidget;
}

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

  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;

  @Input()
  document!: FIGDocument;

  @Output()
  action: EventEmitter<FIGAction> = new EventEmitter<FIGAction>();

  @ViewChildren(MatTreeNode, {read: ElementRef})
  nodes!: QueryList<ElementRef>;

  contextMenuPosition: {x: string, y: string} = {x: '0', y: '0'};

  treeControl: FlatTreeControl<FlatNode> = new FlatTreeControl(
    node => node.level,
    node => node.expandable,
  );
  treeFlattener = new MatTreeFlattener(
    (widget: FIGWidget, level: number) => {
      return {
        expandable: (widget instanceof FIGContainer) ? widget.children.length > 0 : false,
        level: level,
        name: widget.name,
        icon: FIGWidgetType[widget.type],
        isContainer: FIGWidget.isContainer(widget.type),
        widget: widget
      };
    },
    node => node.level,
    node => node.expandable,
    widget => (widget instanceof FIGContainer) ? widget.children : undefined,
  );
  treeSelection: SelectionModel<string> = new SelectionModel(true);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  selectedWidget?: FIGWidget;

  constructor(private readonly formatterService: FormatterService,
              private readonly toast: MatSnackBar) {
  }

  @Input('document')
  set _document(value: FIGDocument) {
    this.document = value;
    this.dataSource.data = this.document.root;
  }

  public update(): void {
    this.dataSource.data = [...this.document.root];
    this.updateTree();
  }

  public openWidget(widget: FIGWidget): void {
    const node: FlatNode | undefined = this.findNodeByUuid(widget.uuid);

    if (!node) {
      return;
    }
    const nodes: FlatNode[] = this.collectNodes(widget);

    for (const node of nodes) {
      if (!this.treeControl.isExpanded(node)) {
        this.treeSelection.select(node.widget.uuid);
        this.treeControl.expand(node);
      }
    }
    if (!this.selectWidget(node)) {
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

  protected trackBy(_: number, node: FlatNode): any {
    return node.widget.trackBy();
  }

  protected isSupported(widget: FIGWidget): Observable<boolean> {
    return this.formatterService.isSupported(widget.type);
  }

  protected useLegacyFallback(node: FlatNode): Observable<boolean> {
    return this.formatterService.useLegacyFallback(node.widget.type);
  }

  protected selectWidget(node: FlatNode): boolean {
    if (node.expandable) {
      this.treeSelection.toggle(node.widget.uuid);
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
      } else {
        this.treeControl.expand(node);
      }
    }
    let isSelected: boolean = false;

    if (this.selectedWidget?.uuid === node.widget.uuid && !(this.selectedWidget instanceof FIGContainer)) {
      this.selectedWidget = undefined;
    } else {
      this.selectedWidget = node.widget;
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

  protected onContextMenu(event: MouseEvent, widget: FIGWidget): void {
    event.preventDefault();
    this.contextMenuPosition.x = `${event.clientX}px`;
    this.contextMenuPosition.y = `${event.clientY}px`;
    this.trigger.menuData = {'widget': widget};
    this.trigger.openMenu();
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

  private collectNodes(widget: FIGWidget): FlatNode[] {
    let node: FlatNode | undefined = this.findNodeByUuid(widget.uuid);

    if (!node) {
      return [];
    }
    const nodes: FlatNode[] = [];
    let parent: FIGContainer | undefined = widget.parent;

    while (parent !== undefined) {
      node = this.findNodeByUuid(parent.uuid);
      if (node) {
        nodes.push(node);
      }
      parent = parent.parent;
    }
    return nodes.reverse();
  }

  private updateTree(): void {
    this.treeSelection.selected.forEach((uuid: string) => {
      const node: FlatNode | undefined = this.findNodeByUuid(uuid);

      if (node) {
        this.treeControl.expand(node);
      }
    });
  }

  private findNodeByUuid(uuid: string): FlatNode | undefined {
    return this.treeControl.dataNodes.find((node) => node.widget.uuid === uuid);
  }

}
