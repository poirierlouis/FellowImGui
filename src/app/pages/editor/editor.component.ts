import {Component, ViewChild} from '@angular/core';
import {CanvasComponent} from "./canvas/canvas.component";
import {TreeComponent} from "./tree/tree.component";
import {FIGWindowWidget} from "../../models/widgets/window.widget";
import {FIGTextWidget} from "../../models/widgets/text.widget";
import {FIGButtonWidget} from "../../models/widgets/button.widget";
import {FIGDocument} from "../../models/document";
import {PropertiesComponent} from "./properties/properties.component";
import {FIGWidget} from "../../models/widgets/widget";
import {MatIcon} from "@angular/material/icon";
import {
  CdkDrag,
  CdkDragEnter,
  CdkDragExit,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList
} from "@angular/cdk/drag-drop";
import {NgTemplateOutlet} from "@angular/common";
import {FIGSeparatorWidget} from "../../models/widgets/separator.widget";
import {MatTooltip} from "@angular/material/tooltip";

interface WidgetBuilder {
  readonly icon: string;
  readonly title: string;
  readonly type: string;
}

@Component({
  selector: 'fig-editor',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    CdkDragPlaceholder,
    NgTemplateOutlet,
    TreeComponent,
    CanvasComponent,
    PropertiesComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild(TreeComponent)
  tree!: TreeComponent;

  document: FIGDocument;
  selectedWidget?: FIGWidget;

  protected readonly widgetBuilders: WidgetBuilder[] = [
    {icon: 'window', title: 'Window', type: 'window'},
    {icon: 'text', title: 'Text', type: 'text'},
    {icon: 'button', title: 'Button', type: 'button'},
    {icon: 'separator', title: 'Separator', type: 'separator'},
  ];

  constructor() {
    this.document = new FIGDocument();
    this.document.root.push(new FIGWindowWidget('Fellow · ImGui'));
    this.document.root.push(new FIGWindowWidget('Bienvenue · ImGui'));
    this.document.root.push(new FIGWindowWidget('Paramount · ImGui'));
    this.document.root[0].children.push(new FIGTextWidget('Hello'));
    this.document.root[0].children.push(new FIGSeparatorWidget());
    this.document.root[0].children.push(new FIGTextWidget('World'));
    this.document.root[0].children.push(new FIGButtonWidget('Click me'));
    this.document.root[1].children.push(new FIGTextWidget('Bonjour'));
    this.document.root[1].children.push(new FIGSeparatorWidget());
    this.document.root[1].children.push(new FIGTextWidget('Monde'));
    this.document.root[1].children.push(new FIGButtonWidget('Clique moi'));
    this.document.root[2].children.push(new FIGTextWidget('Hola'));
    this.document.root[2].children.push(new FIGSeparatorWidget());
    this.document.root[2].children.push(new FIGTextWidget('Mundo'));
    this.document.root[2].children.push(new FIGButtonWidget('Hazme clic'));
    this.document.link();
  }

  protected onDropEntered(event: CdkDragEnter): void {
    const $placeholder: HTMLElement = event.item.getPlaceholderElement();

    if (event.container.id === 'fig-tree-factory') {
      $placeholder.style.display = 'none';
    }
  }

  protected onDropExited(event: CdkDragExit): void {
    const $placeholder: HTMLElement = event.item.getPlaceholderElement();

    if (event.container.id === 'fig-tree-factory') {
      $placeholder.style.display = '';
    }
  }

  protected selectWidget(widget?: FIGWidget): void {
    this.selectedWidget = widget;
  }

  protected updateWidget(widget: FIGWidget): void {
    this.tree.update();
  }

}
