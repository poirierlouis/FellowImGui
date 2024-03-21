import {
  AfterViewInit,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationMetadata,
  AnimationPlayer,
  style
} from '@angular/animations';
import {Subject, Subscription} from 'rxjs';
import 'hammerjs';

export class DismissibleRef {
  private used: boolean = false;

  constructor(private subject: Subject<boolean>) {

  }

  /**
   * Cancel dismiss action. Play an animation restoring element.
   */
  public cancel(): void {
    if (this.used) {
      return;
    }
    this.subject.next(false);
    this.used = true;
  }

  /**
   * Confirm dismiss action. Play an animation removing element.
   */
  public confirm(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.used) {
        resolve();
        return;
      }
      this.subject.next(true);
      this.used = true;
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }
}

@Directive({
  selector: '[figDismissible]',
  standalone: true
})
export class DismissibleDirective implements AfterViewInit, OnDestroy {
  @Input('figDismissibleBackground')
  background?: TemplateRef<any>;

  @Input('figDismissibleIgnoreConfirmation')
  ignoreConfirmation: boolean = true;

  @Output('figDismissed')
  dismissed: EventEmitter<DismissibleRef | undefined> = new EventEmitter();

  @Output('figDismissibleClick')
  delegateClick: EventEmitter<MouseEvent> = new EventEmitter();

  private backgroundView?: EmbeddedViewRef<any>;

  private $el!: HTMLElement;
  private $parent!: HTMLElement;
  private playerDismiss?: AnimationPlayer;
  private playerAbort?: AnimationPlayer;
  private playerRemove?: AnimationPlayer;

  private isActive: boolean = false;
  private deltaX: number = 0;
  private isDismissed: boolean = false;
  private hasConfirmed$: Subject<boolean> = new Subject<boolean>();
  private state?: DismissibleRef;

  private readonly confirmedS: Subscription;

  constructor(private el: ElementRef,
              private containerRef: ViewContainerRef,
              private renderer: Renderer2,
              private builder: AnimationBuilder) {
    this.confirmedS = this.hasConfirmed$.subscribe(this.onDismissResponse.bind(this));
  }

  private get $background(): HTMLElement | undefined {
    return this.backgroundView?.rootNodes[0];
  }

  public ngAfterViewInit(): void {
    this.$el = this.el.nativeElement;
    this.$parent = this.el.nativeElement.parentElement!;
    this.renderer.setStyle(this.$parent, 'overflow-x', 'hidden');
  }

  public ngOnDestroy(): void {
    this.dismissed.complete();
    this.dismissed.unsubscribe();
    this.delegateClick.complete();
    this.delegateClick.unsubscribe();
    this.hasConfirmed$.complete();
    this.confirmedS.unsubscribe();
    this.backgroundView?.destroy();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    if (this.isActive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.delegateClick.emit(event);
  }

  @HostListener('panstart', ['$event'])
  public onPanStart(event: HammerInput): void {
    if (this.$el.dataset['figDrag'] === 'true') {
      return;
    }
    event.preventDefault();
    this.isActive = true;
    this.deltaX = event.deltaX;
    this.createBackground();
    const height: string = window.getComputedStyle(this.$el).height;

    this.renderer.insertBefore(this.$parent, this.$background, this.$el);
    this.renderer.setStyle(this.$el, 'z-index', '1');
    this.renderer.setStyle(this.$el, 'position', 'relative');
    this.renderer.setStyle(this.$el, 'margin-top', `-${height}`);
    this.renderer.addClass(this.$el, 'dragged');
    this.$el.dataset['figSwipe'] = 'true';
  }

  @HostListener('panmove', ['$event'])
  public onPanMove(event: HammerInput): void {
    if (this.$el.dataset['figDrag'] === 'true') {
      return;
    }
    if (!this.isActive) {
      return;
    }
    const width: number = this.$el.offsetWidth;
    let deltaX: number = event.deltaX;

    if (deltaX < 0) {
      deltaX = 0;
    } else if (deltaX > width) {
      deltaX = width;
    }
    if (this.deltaX === deltaX) {
      return;
    }
    const direction: number = Math.sign(deltaX - this.deltaX);

    this.deltaX = deltaX;
    this.isDismissed = (this.deltaX >= width / 3) && direction > 0;
    this.renderer.setStyle(this.$el, 'transform', `translateX(${this.deltaX}px)`);
  }

  @HostListener('panend')
  @HostListener('pancancel')
  public onPanStop(): void {
    if (this.$el.dataset['figDrag'] === 'true') {
      return;
    }
    delete this.$el.dataset['figSwipe'];
    if (!this.isDismissed) {
      this.stopDismiss();
      this.restoreClick();
      return;
    }
    const factory: AnimationFactory = this.builder.build(this.animationDismiss());

    if (this.playerDismiss) {
      this.playerDismiss.destroy();
    }
    this.playerDismiss = factory.create(this.$el);
    this.playerDismiss.onDone(() => {
      if (!this.ignoreConfirmation) {
        this.state = new DismissibleRef(this.hasConfirmed$);
      } else {
        this.state = undefined;
      }
      this.dismissed.emit(this.state);
      this.restoreClick();
    });
    this.playerDismiss.play();
  }

  private animationDismiss(): AnimationMetadata[] {
    return [
      animate('200ms ease-out', style({'transform': `translateX(${this.$el.offsetWidth}px)`}))
    ];
  }

  private animationAbort(): AnimationMetadata[] {
    return [
      animate('100ms ease-in', style({'transform': 'translateX(0)'}))
    ];
  }

  private animationRemove(): AnimationMetadata[] {
    return [
      animate('200ms ease-out', style({'height': 0, 'opacity': 0}))
    ];
  }

  private stopDismiss(): void {
    const factory: AnimationFactory = this.builder.build(this.animationAbort());

    this.playerAbort = factory.create(this.$el);
    this.playerAbort.onDone(() => {
      this.restore();
      this.playerAbort!.destroy();
      this.playerAbort = undefined;
    });
    this.playerAbort.play();
  }

  private onDismissResponse(confirmed: boolean): void {
    if (!confirmed) {
      this.stopDismiss();
      return;
    }
    const factory: AnimationFactory = this.builder.build(this.animationRemove());
    const player: AnimationPlayer = factory.create(this.$el);

    this.playerRemove = factory.create(this.$background);
    this.playerRemove.onDone(this.restore.bind(this));
    this.playerRemove.play();
    player.onDone(() => player.destroy());
    player.play();
  }

  private restoreClick(): void {
    setTimeout(() => {
      this.isActive = false;
    });
  }

  private restore(): void {
    this.isDismissed = false;
    this.backgroundView!.destroy();
    this.backgroundView = undefined;
    this.renderer.removeStyle(this.$el, 'transform');
    this.renderer.removeStyle(this.$el, 'margin-top');
    this.renderer.removeStyle(this.$el, 'position');
    this.renderer.removeStyle(this.$el, 'z-index');
    this.renderer.removeClass(this.$el, 'dragged');
  }

  private createBackground(): void {
    this.backgroundView = this.containerRef.createEmbeddedView(this.background!);
    if (!this.$background) {
      return;
    }
    const marginLeft: string = window.getComputedStyle(this.$el).marginLeft;

    this.renderer.setStyle(this.$background, 'width', `${this.$el.offsetWidth}px`);
    this.renderer.setStyle(this.$background, 'height', `${this.$el.offsetHeight}px`);
    this.renderer.setStyle(this.$background, 'margin-left', marginLeft);
    this.renderer.addClass(this.$background, 'dismissible-container');
  }
}
