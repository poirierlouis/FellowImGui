import {
  type AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  inject,
  Renderer2,
  type TemplateRef,
} from "@angular/core";
import {DragHandleDirective} from "./drag-handle.directive";

@Directive({
  selector: "[figDrag]",
  standalone: true,
})
export class DragDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input("figDragData")
  data?: string;

  @Input("figDragPreview")
  preview!: TemplateRef<unknown>;

  @Input("figDragPreviewData")
  previewData?: unknown;

  @HostBinding("draggable")
  draggable?: boolean = true;

  @ContentChild(DragHandleDirective)
  dragHandle?: DragHandleDirective;

  private $el!: HTMLElement;

  ngAfterViewInit(): void {
    this.$el = this.el.nativeElement;
    if (this.dragHandle) {
      this.dragHandle.draggable = true;
      this.draggable = false;
    }
  }

  @HostListener("dragstart", ["$event"])
  public onDragStart(event: DragEvent): void {
    if (this.$el.dataset["figSwipe"] === "true") {
      return;
    }
    if (event.clientX < this.$el.clientWidth / 4) {
      event.preventDefault();
      return;
    }
    const $placeholder: HTMLElement = this.createPlaceholder();
    const $empty: HTMLElement = this.renderer.createElement("div");

    this.$el.dataset["figDrag"] = "true";
    this.renderer.appendChild(document.body, $placeholder);
    event.dataTransfer?.setData("text/plain", this.data ?? "");
    event.dataTransfer?.setDragImage($empty, 0, 0);
  }

  @HostListener("dragend")
  public onDragEnd(): void {
    const $placeholder: HTMLElement | null = document.body.querySelector("#fig-drag-placeholder");

    $placeholder?.remove();
    delete this.$el.dataset["figDrag"];
  }

  private createPlaceholder(): HTMLElement {
    const $placeholder: HTMLElement = this.renderer.createElement("div");

    $placeholder.id = "fig-drag-placeholder";
    return $placeholder;
  }
}
