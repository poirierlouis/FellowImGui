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
  CdkDragStart,
  CdkDropList
} from "@angular/cdk/drag-drop";
import {NgTemplateOutlet} from "@angular/common";
import {FIGSeparatorWidget} from "../../models/widgets/separator.widget";
import {MatTooltip} from "@angular/material/tooltip";
import {FIGCheckboxWidget} from "../../models/widgets/checkbox.widget";
import {FIGRadioWidget} from "../../models/widgets/radio.widget";
import {FIGLabelWidget} from "../../models/widgets/label.widget";

interface WidgetBuilder {
  readonly icon: string;
  readonly title: string;
  readonly type: string;

  cloneTemporarily?: true;
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
    {icon: 'checkbox', title: 'Checkbox', type: 'checkbox'},
    {icon: 'radio', title: 'Radio', type: 'radio'},
    {icon: 'label', title: 'Label', type: 'label'},
    {icon: 'separator', title: 'Separator', type: 'separator'},
  ];

  constructor() {
    this.document = new FIGDocument();
    this.document.root.push(new FIGWindowWidget('Fellow · ImGui'));
    this.document.root[0].children.push(new FIGTextWidget('Hello'));
    this.document.root[0].children.push(new FIGSeparatorWidget());
    this.document.root[0].children.push(new FIGTextWidget('World'));
    this.document.root[0].children.push(new FIGCheckboxWidget('Toggle me'));
    this.document.root[0].children.push(new FIGButtonWidget('Click me'));
    this.document.root[0].children.push(new FIGRadioWidget('RadioGroup', 'Radio A', undefined, 0));
    this.document.root[0].children.push(new FIGRadioWidget('RadioGroup', 'Radio B', undefined, 1));
    this.document.root[0].children.push(new FIGRadioWidget('RadioGroup', 'Radio C', undefined, 2));
    this.document.root[0].children.push(new FIGLabelWidget());
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

  protected onDragStart(event: CdkDragStart): void {
    const $placeholder: HTMLElement = event.source.getPlaceholderElement();

    if (event.source.dropContainer.id === 'fig-tree-factory') {
      $placeholder.style.display = 'none';
    }
  }

  protected onDragEnded(): void {
    const index: number = this.widgetBuilders.findIndex((builder) => builder.cloneTemporarily);

    if (index === -1) {
      return;
    }
    this.widgetBuilders.splice(index, 1);
  }

  protected onDragExited(event: CdkDragExit): void {
    const type: string = event.item.data;
    const hasClone: number = this.widgetBuilders.findIndex((builder) => builder.cloneTemporarily);

    if (hasClone !== -1) {
      return;
    }
    const index: number = this.widgetBuilders.findIndex((builder) => builder.type === type)!;
    const builder: WidgetBuilder = this.widgetBuilders[index];

    this.widgetBuilders.splice(index, 0, {
      ...builder,
      cloneTemporarily: true
    });
  }

  protected selectWidget(widget?: FIGWidget): void {
    this.selectedWidget = widget;
  }

  protected updateWidget(widget: FIGWidget): void {
    this.tree.update();
  }
}
