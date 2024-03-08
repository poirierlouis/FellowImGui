import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
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
import {WidgetSettingsComponent} from "./widget-settings/widget-settings.component";
import {MatDivider} from "@angular/material/divider";

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
    WidgetSettingsComponent,
    MatDivider
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
