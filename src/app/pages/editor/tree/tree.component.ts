import {Component, Input} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodeToggle
} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {FIGContainer} from "../../../models/container";
import {FIGWidget} from "../../../models/widget";

@Component({
  selector: 'fig-tree',
  standalone: true,
  imports: [
    MatIcon,
    MatDrawer,
    MatButton,
    MatIconButton,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle,
    MatNestedTreeNode,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {
  @Input()
  root: FIGContainer[] = [];

  treeControl = new NestedTreeControl<FIGWidget>(node => {
    if (node instanceof FIGContainer) {
      return node.children;
    }
    return undefined;
  });
  dataSource = new MatTreeNestedDataSource<FIGWidget>();

  selectedWidget?: FIGWidget;

  @Input('root')
  set _root(value: FIGContainer[] | undefined) {
    this.root = value ?? [];
    this.dataSource.data = this.root;
  }

  protected hasChild(_: number, node: FIGWidget) {
    if (node instanceof FIGContainer) {
      return !!node.children && node.children.length > 0;
    }
    return false;
  }

  protected selectWidget(widget: FIGWidget): void {
    this.selectedWidget = widget;
  }
}
