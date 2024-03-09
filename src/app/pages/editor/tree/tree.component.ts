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
import {FIGContainer} from "../../../models/widgets/container";
import {FIGWidget} from "../../../models/widgets/widget";
import {WidgetSettingsComponent} from "./widget-settings/widget-settings.component";
import {MatDivider} from "@angular/material/divider";
import {DismissibleDirective} from "../../../directives/dismissible.directive";

@Component({
  selector: 'fig-tree',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeOutlet,
    MatTreeNodeToggle,
    MatNestedTreeNode,
    DismissibleDirective,
    WidgetSettingsComponent,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {
  @Input()
  root: FIGContainer[] = [];

  treeControl = new NestedTreeControl<FIGWidget>((widget) => {
    if (widget instanceof FIGContainer) {
      return widget.children;
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

  protected hasChild(_: number, widget: FIGWidget) {
    if (widget instanceof FIGContainer) {
      return widget.children.length > 0;
    }
    return false;
  }

  protected trackBy(_: number, widget: FIGWidget): any {
    return widget.trackBy();
  }

  protected selectWidget(widget: FIGWidget): void {
    this.selectedWidget = widget;
  }

  protected removeWidget(widget: FIGWidget): void {
    if (this.selectedWidget?.uuid === widget.uuid) {
      this.selectedWidget = undefined;
    }
    for (let i = 0; i < this.root.length; i++) {
      const container: FIGContainer = this.root[i];

      if (container.uuid === widget.uuid) {
        this.root.splice(i, 1);
        this.dataSource.data = this.root;
        return;
      } else if (container.remove(widget)) {
        this.dataSource.data = this.root;
        return;
      }
    }
  }

}
