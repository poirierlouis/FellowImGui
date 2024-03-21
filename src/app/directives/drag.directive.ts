import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {DragHandleDirective} from "./drag-handle.directive";

@Directive({
  selector: '[figDrag]',
  standalone: true
})
export class DragDirective implements AfterViewInit {

  @Input('figDragData')
  data?: string;

  @Input('figDragPreview')
  preview!: TemplateRef<any>;

  @Input('figDragPreviewData')
  previewData?: any;

  @HostBinding('draggable')
  draggable?: boolean = true;

  @ContentChild(DragHandleDirective)
  dragHandle?: DragHandleDirective;

  private previewRef?: EmbeddedViewRef<any>;
  private onDragListener?: () => void;

  private $el!: HTMLElement;

  constructor(private readonly el: ElementRef,
              private readonly vcr: ViewContainerRef,
              private readonly renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.$el = this.el.nativeElement;
    if (this.dragHandle) {
      this.dragHandle.draggable = true;
      this.draggable = false;
    }
  }

  @HostListener('dragstart', ['$event'])
  public onDragStart(event: DragEvent): void {
    if (this.$el.dataset['figSwipe'] === 'true') {
      return;
    }
    const $placeholder: HTMLElement = this.createPlaceholder();
    const $preview: HTMLElement = this.createPreview();

    this.renderer.appendChild(document.body, $placeholder);
    this.renderer.appendChild(document.body, $preview);
    this.$el.dataset['figDrag'] = 'true';
    this.onDragListener = this.renderer.listen(document, 'dragover', this.onDrag.bind(this));
    event.dataTransfer!.setData('text/plain', this.data ?? '');
  }

  public onDrag(event: DragEvent): void {
    const $preview: HTMLElement | null = document.body.querySelector('#fig-drag-preview');

    if (!$preview) {
      return;
    }
    //this.renderer.setStyle($preview, 'transform', `translateX(${event.pageX}px)`);
    this.renderer.setStyle($preview, 'transform', `translateY(${event.pageY}px)`);
  }

  @HostListener('dragend')
  public onDragEnd(): void {
    const $placeholder: HTMLElement | null = document.body.querySelector('#fig-drag-placeholder');
    const $preview: HTMLElement | null = document.body.querySelector('#fig-drag-preview');

    $placeholder?.remove();
    $preview?.remove();
    this.previewRef?.destroy();
    this.previewRef = undefined;
    this.onDragListener?.();
    this.onDragListener = undefined;
    delete this.$el.dataset['figDrag'];
    this.$el.dispatchEvent(new MouseEvent('mouseup'));
  }

  private createPlaceholder(): HTMLElement {
    const $placeholder: HTMLElement = this.renderer.createElement('div');

    $placeholder.id = 'fig-drag-placeholder';
    return $placeholder;
  }

  private createPreview(): HTMLElement {
    this.previewRef = this.vcr.createEmbeddedView(this.preview, {$implicit: this.previewData});
    const $preview: HTMLElement = this.previewRef.rootNodes[0];

    $preview.id = 'fig-drag-preview';
    return $preview;
  }

}
