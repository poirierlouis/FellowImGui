import {Component, ViewChild} from '@angular/core';
import {CanvasComponent} from "./canvas/canvas.component";
import {TreeComponent} from "./tree/tree.component";
import {FIGWindowWidget} from "../../models/widgets/window.widget";
import {FIGDocument} from "../../models/document";
import {PropertiesComponent} from "./properties/properties.component";
import {FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
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
import {MatTooltip} from "@angular/material/tooltip";
import {FIGWidgetBuilder, FIGWidgetFactory} from "../../models/widgets/widget.factory";
import {MatDivider} from "@angular/material/divider";
import {FIGWidgetHelper} from '../../models/widgets/widget.helper';
import {Color} from "../../models/math";
import {FIGDir} from "../../models/widgets/button.widget";
import {MatIconButton} from "@angular/material/button";
import {FormatterService} from "../../services/formatter.service";
import {FIGInputNumberType} from "../../models/widgets/input-number.widget";

interface FIGWidgetItemBuilder extends FIGWidgetBuilder {
  cloneTemporarily?: true;
}

interface FIGWidgetCategory {
  readonly start: FIGWidgetType;
  readonly title: string;
}

@Component({
  selector: 'fig-editor',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatTooltip,
    MatIconButton,
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

  protected readonly builders: FIGWidgetItemBuilder[] = FIGWidgetFactory.builders;
  protected readonly categories: FIGWidgetCategory[] = [
    {start: FIGWidgetType.text, title: 'Basics'},
    {start: FIGWidgetType.label, title: 'Forms / Inputs'},
  ];
  protected readonly FIGWidgetType = FIGWidgetType;

  constructor(private readonly formatterService: FormatterService) {
    this.document = new FIGDocument();
    const color: Color = {r: 0.88, g: 0.66, b: 0.1, a: 1.0};
    const layouts: FIGWindowWidget = FIGWidgetHelper.createWindow({
      label: 'Basics · FIG',
      size: {width: 320, height: 398}
    }, [
      FIGWidgetHelper.createText({text: 'Hello world!'}),
      FIGWidgetHelper.createText({text: 'I\'m colorful!', color: color}),
      FIGWidgetHelper.createText({text: 'I\'m disabled!', isDisabled: true}),
      FIGWidgetHelper.createText({text: 'I\'m a bullet!', hasBullet: true}),
      FIGWidgetHelper.createText({text: 'I\'m one with a tooltip!', tooltip: 'Explain me!'}),
      FIGWidgetHelper.createText({
        text: 'I\'m "complex and long". Lorem ipsum dolor sit amet, consectetur adipiscing ' +
          'elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
          'nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        color: color, isWrapped: true, hasBullet: true, tooltip: 'Wow O.O'
      }),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createButton({label: 'Simple button'}),
      FIGWidgetHelper.createButton({label: 'Small button', isSmall: true}),
      FIGWidgetHelper.createButton({label: 'Fill button', isFill: true}),
      FIGWidgetHelper.createButton({label: 'Arrow button', arrow: FIGDir.down}),
      FIGWidgetHelper.createButton({label: 'Button w/ tooltip', tooltip: 'Can you see me?'}),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createProgressBar({value: 0.00}),
      FIGWidgetHelper.createProgressBar({value: 0.42, isFill: true, tooltip: 'Fill horizontally.'}),
      FIGWidgetHelper.createProgressBar({value: 1.00, label: 'Loading'}),
    ]);
    const basics: FIGWindowWidget = FIGWidgetHelper.createWindow({
      label:
        'Forms / Inputs · FIG',
      size: {width: 460, height: 564}
    }, [
      FIGWidgetHelper.createLabel({label: 'Label', value: 'Input'}),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createInputText({label: 'Username'}),
      FIGWidgetHelper.createInputText({label: 'Username w/ hint', hint: 'e.g. Fig'}),
      FIGWidgetHelper.createInputText({label: 'Username w/ tooltip', tooltip: 'Be anonymous'}),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createInputNumber({label: 'int', tooltip: 'Hold CTRL to fast increment/decrement.'}),
      FIGWidgetHelper.createInputNumber({label: 'int2', value: [0, 1], dataType: FIGInputNumberType.int2}),
      FIGWidgetHelper.createInputNumber({label: 'int3', value: [1, 2, 3], dataType: FIGInputNumberType.int3}),
      FIGWidgetHelper.createInputNumber({label: 'int4', value: [5, 8, 13, 21], dataType: FIGInputNumberType.int4}),
      FIGWidgetHelper.createInputNumber({label: 'float', dataType: FIGInputNumberType.float}),
      FIGWidgetHelper.createInputNumber({label: 'float2', value: [0.1, 1.1], dataType: FIGInputNumberType.float2}),
      FIGWidgetHelper.createInputNumber({label: 'float3', value: [1.2, 2.3, 3.5], dataType: FIGInputNumberType.float3}),
      FIGWidgetHelper.createInputNumber({
        label: 'float4',
        value: [5.8, 8.13, 13.21, 21.34],
        dataType: FIGInputNumberType.float4
      }),
      FIGWidgetHelper.createInputNumber({
        label: 'double',
        step: 0.001,
        stepFast: 0.5,
        dataType: FIGInputNumberType.double
      }),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createInputColorEdit({label: 'color', tooltip: 'Define an RGB color using inputs/picker.'}),
      FIGWidgetHelper.createInputColorEdit({label: 'color w/ alpha', withAlpha: true}),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createCheckbox({label: 'Fig'}),
      FIGWidgetHelper.createCheckbox({label: 'Banana', isChecked: true}),
      FIGWidgetHelper.createCheckbox({label: 'Orange', tooltip: 'Juicy :P'}),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createRadio({label: 'Galactic Funk', groupId: 'RadioChannel', index: 0}),
      FIGWidgetHelper.createRadio({label: 'Space Rock', groupId: 'RadioChannel', index: 1}),
      FIGWidgetHelper.createRadio({
        label: 'Jazzy Moon',
        groupId: 'RadioChannel', index: 2, tooltip: 'Chill on moons of Wablad'
      }),
      FIGWidgetHelper.createSeparator(),
      FIGWidgetHelper.createCombo({
        label: 'Jump Destination',
        items: ['Earth', 'Mars', 'Jupiter', 'Europa', 'Saturn', 'Titan'],
        tooltip: 'Where should we go?'
      })
    ]);

    this.document.root.push(layouts);
    this.document.root.push(basics);
    this.document.link();
  }

  public onFormat(): void {
    const output: string | undefined = this.formatterService.format(this.document);

    if (!output) {
      // TODO: show toast "You must select a language to format to."
      return;
    }
    navigator.clipboard.writeText(output);
  }

  protected showCategorySeparator(builder: FIGWidgetItemBuilder): boolean {
    return !!this.categories.find((category) => category.start === builder.type);
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
    const index: number = this.builders.findIndex((builder) => builder.cloneTemporarily);

    if (index === -1) {
      return;
    }
    this.builders.splice(index, 1);
  }

  protected onDragExited(event: CdkDragExit): void {
    const type: FIGWidgetType = event.item.data;
    const hasClone: number = this.builders.findIndex((builder) => builder.cloneTemporarily);

    if (hasClone !== -1) {
      return;
    }
    const index: number = this.builders.findIndex((builder) => builder.type === type)!;
    const builder: FIGWidgetBuilder = this.builders[index];

    this.builders.splice(index, 0, {
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
