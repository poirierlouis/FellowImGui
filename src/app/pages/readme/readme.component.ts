import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {DOMUtils} from "../../components/dom.utils";

@Component({
  selector: 'fig-readme',
  standalone: true,
  imports: [
    MatIcon,
    MatFabButton
  ],
  templateUrl: './readme.component.html',
  styleUrl: './readme.component.css'
})
export class ReadmeComponent implements AfterViewInit {

  @ViewChild('step01')
  step01!: ElementRef;

  @ViewChild('step02')
  step02!: ElementRef;

  @ViewChild('step03')
  step03!: ElementRef;

  @ViewChild('step04')
  step04!: ElementRef;

  private $currentStep?: HTMLMediaElement;

  private get $steps(): HTMLMediaElement[] {
    return [this.step01, this.step02, this.step03, this.step04].map((step) => step.nativeElement as HTMLMediaElement);
  }

  public ngAfterViewInit(): void {
    this.$currentStep = this.$steps[0];
  }

  @HostListener('scroll', ['$event'])
  protected onScroll(event: Event): void {
    const $step: HTMLMediaElement | undefined = this.findVisible(event.target as HTMLElement);

    if (!$step || $step === this.$currentStep) {
      return;
    }
    if (this.$currentStep) {
      this.$currentStep.pause();
      this.$currentStep.currentTime = 0.0;
    }
    this.$currentStep = $step;
    this.$currentStep.play();
  }

  private findVisible($root: HTMLElement): HTMLMediaElement | undefined {
    return this.$steps.find(($step) => DOMUtils.isVisible($root, $step));
  }

}
