import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CanvasComponent} from "./canvas/canvas.component";
import {TreeComponent} from "./tree/tree.component";
import {FIGDocument} from "../../models/document";
import {PropertiesComponent} from "./properties/properties.component";
import {FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {FIGWidgetBuilder, FIGWidgetFactory} from "../../models/widgets/widget.factory";
import {MatDivider} from "@angular/material/divider";
import {MatIconButton} from "@angular/material/button";
import {FormatterService} from "../../services/formatter.service";
import {DragDirective} from "../../directives/drag.directive";
import {FIGEvent} from "../../models/events/event";
import {DocumentService} from "../../services/document.service";
import {FIGDocumentReaderError, FIGDocumentReaderErrorCode} from "../../parsers/document.reader";
import {Observable, Subscription} from "rxjs";
import {FIGDocumentWriterError, FIGDocumentWriterErrorCode} from "../../parsers/document.writer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ConfigComponent} from "./config/config.component";
import {FIGAction, FIGActionType} from "../../models/actions/action";
import {FIGShortcut} from "../../models/actions/shortcut";
import {LanguagePickerComponent} from "./language-picker/language-picker.component";

interface FIGWidgetBuilderCategory {
  readonly title: string;
  readonly builders: FIGWidgetBuilder[];
}

@Component({
  selector: 'fig-editor',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIcon,
    MatTooltip,
    MatDivider,
    MatIconButton,
    MatTab,
    MatTabGroup,
    NgTemplateOutlet,
    DragDirective,
    TreeComponent,
    ConfigComponent,
    CanvasComponent,
    PropertiesComponent,
    LanguagePickerComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit, OnDestroy {

  @ViewChild('openPicker')
  openPicker!: ElementRef;

  @ViewChild(MatTabGroup)
  tabs!: MatTabGroup;

  @ViewChild(TreeComponent)
  tree!: TreeComponent;

  @ViewChild(CanvasComponent)
  canvas!: CanvasComponent;

  document?: FIGDocument;
  selectedWidget?: FIGWidget;

  tabsWidth: string = '360px';
  canvasWidth: string = 'calc(100% - (360px + 4px + 360px))';
  isSliding: boolean = false;

  protected readonly categories: FIGWidgetBuilderCategory[] = [
    {title: 'Layouts', builders: FIGWidgetFactory.filterBetween(FIGWidgetType.window, FIGWidgetType.dummy)},
    {title: 'Basics', builders: FIGWidgetFactory.filterBetween(FIGWidgetType.separator, FIGWidgetType.menuItem)},
    {title: 'Forms / Inputs', builders: FIGWidgetFactory.filterBetween(FIGWidgetType.label, FIGWidgetType.combo)},
    {title: 'Blocs', builders: FIGWidgetFactory.filterBetween(FIGWidgetType.blocFor)},
  ];
  protected readonly FIGWidgetType = FIGWidgetType;

  private listenerS?: Subscription;
  private readS?: Subscription;
  private writeS?: Subscription;
  private requestS?: Subscription;

  private shortcut: FIGShortcut = new FIGShortcut();

  constructor(private readonly formatterService: FormatterService,
              private readonly documentService: DocumentService,
              private readonly toast: MatSnackBar,
              private readonly http: HttpClient,
              private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.loadDemo();
  }

  ngOnDestroy(): void {
    this.listenerS?.unsubscribe();
    this.readS?.unsubscribe();
    this.writeS?.unsubscribe();
    this.requestS?.unsubscribe();
  }

  public onFormat(): void {
    if (!this.document) {
      return;
    }
    const output: string | undefined = this.formatterService.format(this.document);

    if (!output) {
      // TODO: show toast "You must select a language to format to."
      return;
    }
    navigator.clipboard.writeText(output);
    this.toast.open(`'${this.formatterService.currentLanguage}' code generated in clipboard.`);
  }

  public onNew(): void {
    const document: FIGDocument = new FIGDocument();

    this.openDocument(document);
  }

  public async onOpen(): Promise<void> {
    this.openPicker.nativeElement.click();
  }

  public async open(event: Event): Promise<void> {
    // @ts-expect-error event file type not defined
    const files: FileList = event.target!.files;

    if (files.length !== 1) {
      // TODO: show toast.
      return;
    }
    const file: File = files[0];

    this.readFile(file);
  }

  public onSave(): void {
    if (!this.document) {
      return;
    }
    this.writeS?.unsubscribe();
    this.writeS = this.documentService.write(this.document).subscribe({
      next: this.saveDocument.bind(this),
      error: this.saveDocumentFailed.bind(this)
    });
  }

  protected isSupported(type: FIGWidgetType): Observable<boolean> {
    return this.formatterService.isSupported(type);
  }

  protected useLegacyFallback(type: FIGWidgetType): Observable<boolean> {
    return this.formatterService.useLegacyFallback(type);
  }

  protected async onStylesUpdated(): Promise<void> {
    await this.canvas.updateConfig();
  }

  @HostListener('document:keydown', ['$event'])
  protected async onKeyPressed(event: KeyboardEvent): Promise<void> {
    this.shortcut.ctrl = event.ctrlKey || event.metaKey;
    this.shortcut.key = event.key;
    if (this.shortcut.canDuplicate() && this.selectedWidget) {
      event.preventDefault();
      this.tree.duplicateWidget(this.selectedWidget);
    } else if (this.shortcut.canGenerate() && this.selectedWidget) {
      event.preventDefault();
      await this.tree.generateCode(this.selectedWidget);
    } else if (this.shortcut.canDelete(event) && this.selectedWidget) {
      event.preventDefault();
      this.tree.removeWidget(this.selectedWidget);
    }
  }

  @HostListener('document:keyup', ['$event'])
  protected onKeyReleased(event: KeyboardEvent): void {
    this.shortcut.ctrl = event.ctrlKey || event.metaKey;
    this.shortcut.key = undefined;
  }

  protected onResetSliding(): void {
    this.slideTo(360);
  }

  protected onStartSliding(event: MouseEvent): void {
    this.isSliding = true;
    this.slideTo(event.clientX);
  }

  @HostListener('mousemove', ['$event'])
  protected onSliding(event: MouseEvent): void {
    if (!this.isSliding) {
      return;
    }
    this.slideTo(event.clientX);
  }

  @HostListener('mouseup', ['$event'])
  protected onStopSliding(event: MouseEvent): void {
    if (!this.isSliding) {
      return;
    }
    this.slideTo(event.clientX);
    this.isSliding = false;
  }

  protected onWidgetAction(action: FIGAction): void {
    if (action.type === FIGActionType.select) {
      this.selectWidget(action.widget);
    } else if (action.type === FIGActionType.duplicate) {
      this.duplicateWidget(action);
    } else if (action.type === FIGActionType.remove) {
      this.removeWidget(action);
    }
  }

  protected selectWidget(widget?: FIGWidget): void {
    this.selectedWidget = widget;
    if (this.shortcut.canSelect()) {
      this.selectedWidget?.select();
    }
  }

  protected duplicateWidget(action: FIGAction): void {
    if (!action.widget || !this.document) {
      return;
    }
    // TODO: undo/redo?
  }

  protected removeWidget(action: FIGAction): void {
    if (!action.widget || !this.document) {
      return;
    }
    // TODO: undo/redo?
  }

  protected updateWidget(_widget: FIGWidget): void {
    this.tree.update();
  }

  private readFile(file: File): void {
    this.readS?.unsubscribe();
    this.readS = this.documentService.read(file).subscribe({
      next: this.openDocument.bind(this),
      error: this.openDocumentFailed.bind(this)
    });
  }

  private openDocument(document: FIGDocument): void {
    this.selectWidget(undefined);
    this.document = document;
    this.document.link();
    this.listenerS?.unsubscribe();
    this.listenerS = this.document.listen().subscribe(this.onWidgetEvent.bind(this));
  }

  private openDocumentFailed(error: FIGDocumentReaderError): void {
    let message: string = 'Failed to read document. Please report this issue.';

    switch (error.code) {
      case FIGDocumentReaderErrorCode.ExpectContainer:
        message = `Failed to read the root of document. Widget '${FIGWidgetType[error.type!]}' is unexpected here.`;
        break;
      case FIGDocumentReaderErrorCode.TypeNotImplemented:
        message = `Failed to read a widget in document. Widget '${FIGWidgetType[error.type!]}' is not implemented.`;
        break;
    }
    this.toast.open(message);
  }

  private saveDocument(file: File): void {
    const $savePicker: HTMLAnchorElement = this.renderer.createElement('a');
    const url: string = URL.createObjectURL(file);

    $savePicker.href = url;
    $savePicker.download = file.name;
    this.renderer.appendChild(document.body, $savePicker);
    $savePicker.click();
    this.renderer.removeChild(document.body, $savePicker);
    URL.revokeObjectURL(url);
  }

  private saveDocumentFailed(error: FIGDocumentWriterError): void {
    let message: string = 'Failed to save document. Please report this issue.';

    switch (error.code) {
      case FIGDocumentWriterErrorCode.TypeNotImplemented:
        message = `Failed to save a widget in document. Widget '${FIGWidgetType[error.type!]}' is not implemented.`;
        break;
    }
    this.toast.open(message);
  }

  private loadDemo(): void {
    this.requestS?.unsubscribe();
    this.requestS = this.http.get('./assets/demo.fig', {responseType: 'text'})
      .subscribe((response: string) => {
        const file: File = new File([response], 'demo.fig');

        this.readFile(file);
      });
  }

  private onWidgetEvent(events: FIGEvent[]): void {
    if (!this.shortcut.canSelect()) {
      return;
    }
    this.tabs.selectedIndex = 0;
    const widget: FIGWidget = events[0].target;

    this.tree.openWidget(widget);
  }

  private slideTo(x: number): void {
    let width: number = x;

    width = Math.min(width, window.innerWidth / 2);
    width = Math.max(width, 170);
    this.tabsWidth = `${width}px`;
    this.canvasWidth = `calc(100% - (${this.tabsWidth} + 4px + 360px))`;
    setTimeout(() => {
      this.canvas.onResize();
    });
  }

}
