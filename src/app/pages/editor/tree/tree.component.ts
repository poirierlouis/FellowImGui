import {Component} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
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

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Window',
    children: [{name: 'Text'},],
  },
  {
    name: 'Window',
    children: [
      {
        name: 'Button',
      },
      {
        name: 'Column',
        children: [{name: 'Text'}, {name: 'Text'}],
      },
    ],
  },
];

@Component({
  selector: 'fig-tree',
  standalone: true,
  imports: [
    MatDrawer,
    MatIcon,
    MatIconButton,
    MatNestedTreeNode,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
