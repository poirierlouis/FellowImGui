import {AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output} from "@angular/core";

export interface FIGDropEvent {
  readonly drag?: string;
  readonly drop?: string;
  readonly direction: FIGDropDirection;
  readonly duplicate: boolean;
}

export type FIGDropDirection = 'before' | 'insert' | 'after';

@Directive({
  selector: '[figDrop]',
  standalone: true
})
export class DropDirective implements AfterViewInit {

  @Input('figDropData')
  data?: string;

  @Output('figDropped')
  dropped: EventEmitter<FIGDropEvent> = new EventEmitter<FIGDropEvent>();

  private $el!: HTMLElement;

  constructor(private readonly el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.$el = this.el.nativeElement;
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    const direction: FIGDropDirection = this.computeDirection(this.$el, event);
    let $placeholder: HTMLDivElement | null = document.body.querySelector('#fig-drag-placeholder');

    if (!$placeholder) {
      return;
    }
    const data: DOMStringMap = $placeholder.dataset;

    if (data['handle'] !== this.data || data['direction'] === direction) {
      return;
    }
    data['direction'] = direction;
    $placeholder = $placeholder.parentElement!.removeChild($placeholder);
    if (direction === 'before') {
      this.$el.insertAdjacentElement('beforebegin', $placeholder);
    } else {
      this.$el.insertAdjacentElement('afterend', $placeholder);
    }
  }

  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: DragEvent): void {
    event.preventDefault();
    const direction: FIGDropDirection = this.computeDirection(this.$el, event);
    const $placeholder: HTMLDivElement | null = document.body.querySelector('#fig-drag-placeholder');

    if (!$placeholder) {
      return;
    }
    const data: DOMStringMap = $placeholder.dataset;

    if (data['direction'] === direction && data['handle'] === this.data) {
      return;
    }
    data['direction'] = direction;
    data['handle'] = this.data;
    $placeholder.style.marginLeft = this.$el.style.paddingLeft;
    if (direction === 'before') {
      this.$el.insertAdjacentElement('beforebegin', $placeholder);
    } else {
      this.$el.insertAdjacentElement('afterend', $placeholder);
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    const direction: FIGDropDirection = this.computeDirection(this.$el, event);
    const data: string = event.dataTransfer!.getData('text/plain');
    const $placeholder: HTMLElement | null = document.body.querySelector('#fig-drag-placeholder');

    $placeholder?.remove();
    delete this.$el.dataset['figDrag'];
    this.dropped.emit({
      drag: data,
      drop: this.data,
      direction: direction,
      duplicate: event.ctrlKey || event.metaKey
    });
  }

  private computeDirection($element: HTMLElement, event: DragEvent): FIGDropDirection {
    const isContainer: boolean = $element.classList.contains('container');
    const rect: DOMRect = $element.getBoundingClientRect();
    const height: number = $element.clientHeight;
    const y: number = event.clientY - rect.top;

    if (isContainer) {
      if (y <= height / 3) {
        return 'before';
      } else if (y < height * 2 / 3) {
        return 'insert';
      } else {
        return 'after';
      }
    }
    return (y <= height / 2) ? 'before' : 'after';
  }

}
