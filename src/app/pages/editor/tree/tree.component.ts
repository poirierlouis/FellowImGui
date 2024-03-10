import {Component, Input} from '@angular/core';
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
import {FIGWidget} from "../../../models/widgets/widget";
import {WidgetSettingsComponent} from "./widget-settings/widget-settings.component";
import {MatDivider} from "@angular/material/divider";
import {DismissibleDirective} from "../../../directives/dismissible.directive";
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {FIGDocument} from "../../../models/document";
import {SelectionModel} from "@angular/cdk/collections";

interface FlatNode {
  expandable: boolean;
  level: number;

  name: string;
  icon: string;
  widget: FIGWidget;
}

@Component({
  selector: 'fig-tree',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    MatIcon,
    MatDivider,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle,
    MatNestedTreeNode,
    MatTreeNodePadding,
    DismissibleDirective,
    WidgetSettingsComponent,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  @Input()
  document!: FIGDocument;

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
        icon: widget.icon,
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

  protected hasChild(_: number, node: FlatNode) {
    return node.expandable;
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
    this.selectedWidget = node.widget;
  }

  protected moveWidget(event: CdkDragDrop<FIGWidget>): void {
    const dragWidget: FIGWidget | undefined = this.findWidgetInTree(event.previousIndex);
    const dropWidget: FIGWidget | undefined = this.findWidgetInTree(event.currentIndex);

    if (!dragWidget || !dropWidget) {
      console.warn('drag/drop widgets not found.');
      return;
    }
    if (this.document.moveWidget(dragWidget, dropWidget)) {
      this.dataSource.data = [...this.document.root];
      this.updateTree();
    }
  }

  protected removeWidget(widget: FIGWidget): void {
    if (this.selectedWidget?.uuid === widget.uuid) {
      this.selectedWidget = undefined;
    }
    if (this.document.removeWidget(widget)) {
      this.dataSource.data = [...this.document.root];
      this.updateTree();
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

  private findWidgetInTree(index: number): FIGWidget | undefined {
    let i: number = 0;

    for (const container of this.document.root) {
      if (i === index) {
        return container;
      }
      if (this.treeSelection.isSelected(container.uuid)) {
        i++;
        // TODO: use recursive implementation.
        for (const child of container.children) {
          if (i === index) {
            return child;
          }
          i++;
        }
      } else {
        i++;
      }
    }
    return undefined;
  }

}
