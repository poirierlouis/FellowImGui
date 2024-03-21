import {Component, EventEmitter, Input, Output} from '@angular/core';
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
import {FIGWidgetFactory} from "../../../models/widgets/widget.factory";
import {DragDirective} from "../../../directives/drag.directive";
import {DropDirective, FIGDropEvent} from "../../../directives/drop.directive";
import {DragHandleDirective} from "../../../directives/drag-handle.directive";

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
    MatIcon,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle,
    MatNestedTreeNode,
    MatTreeNodePadding,
    DragDirective,
    DropDirective,
    DragHandleDirective,
    DismissibleDirective,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  @Input()
  document!: FIGDocument;

  @Output('selectWidget')
  onSelectWidget: EventEmitter<FIGWidget | undefined> = new EventEmitter<FIGWidget | undefined>();

  treeControl = new FlatTreeControl<FlatNode>(
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
        isContainer: FIGWidgetFactory.isContainer(widget.type),
        widget: widget
      };
    },
    node => node.level,
    node => node.expandable,
    widget => (widget instanceof FIGContainer) ? widget.children : undefined,
  );
  treeSelection = new SelectionModel<string>(true);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  selectedWidget?: FIGWidget;

  @Input('document')
  set _document(value: FIGDocument) {
    this.document = value;
    this.dataSource.data = this.document.root;
  }

  public update(): void {
    this.dataSource.data = [...this.document.root];
    this.updateTree();
  }

  protected trackBy(_: number, node: FlatNode): any {
    return node.widget.trackBy();
  }

  protected selectWidget(node: FlatNode): void {
    if (node.expandable) {
      this.treeSelection.toggle(node.widget.uuid);
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
      } else {
        this.treeControl.expand(node);
      }
    }
    if (this.selectedWidget?.uuid === node.widget.uuid && !(this.selectedWidget instanceof FIGContainer)) {
      this.selectedWidget = undefined;
    } else {
      this.selectedWidget = node.widget;
    }
    this.onSelectWidget.emit(this.selectedWidget);
  }

  protected dropWidget(event: FIGDropEvent): void {
    const drag: FIGWidget | undefined = (!event.drag) ? undefined : this.document.findByUuid(event.drag);
    const drop: FIGWidget | undefined = (!event.drop) ? undefined : this.document.findByUuid(event.drop);
    const type: FIGWidgetType | undefined = FIGWidgetType[event.drag as keyof typeof FIGWidgetType];
    let needUpdate: boolean = false;

    if (type !== undefined) {
      needUpdate = this.document.createWidget(type, drop, event.direction);
    } else if (drag && drop) {
      needUpdate = this.document.moveWidget(drag, drop, event.direction);
    }
    if (needUpdate) {
      this.update();
    }
  }

  protected removeWidget(widget: FIGWidget): void {
    if (this.selectedWidget?.uuid === widget.uuid) {
      this.selectedWidget = undefined;
      this.onSelectWidget.emit(undefined);
    }
    if (this.document.removeWidget(widget)) {
      this.update();
    }
  }

  private updateTree(): void {
    this.treeSelection.selected.forEach((uuid: string) => {
      const node: FlatNode | undefined = this.treeControl.dataNodes.find((node: FlatNode) => node.widget.uuid === uuid);

      if (node) {
        this.treeControl.expand(node);
      }
    });
  }

}
