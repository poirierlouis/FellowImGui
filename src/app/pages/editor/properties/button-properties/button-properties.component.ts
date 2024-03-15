import {Component, DestroyRef, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FIGWidget} from "../../../../models/widgets/widget";
import {FIGDir, FIGButtonWidget} from "../../../../models/widgets/button.widget";
import {MatIcon} from "@angular/material/icon";
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'fig-button-properties',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './button-properties.component.html',
  styleUrl: './button-properties.component.css'
})
export class ButtonPropertiesComponent extends AbstractPropertiesComponent<FIGButtonWidget> {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  override form: FormGroup = new FormGroup<any>({
    text: new FormControl<string>(''),
    tooltip: new FormControl<string | null>(null),
    isFill: new FormControl<boolean>(false),
    isSmall: new FormControl<boolean>(false),
    arrow: new FormControl<FIGDir>(FIGDir.none),
  });

  protected readonly FIGArrowDirection = FIGDir;

  constructor(dr: DestroyRef) {
    super(dr);
    this.listenProperty('text').subscribe(this.onTextChanged.bind(this));
    this.listenProperty('tooltip').subscribe(this.onTooltipChanged.bind(this));
    this.listenProperty('isFill').subscribe(this.onIsFillChanged.bind(this));
    this.listenProperty('isSmall').subscribe(this.onIsSmallChanged.bind(this));
    this.listenProperty('arrow').subscribe(this.onArrowChanged.bind(this));
  }

  protected override updateForm() {
    if (!this.widget) {
      return;
    }
    this.setProperty('text', this.widget.text);
    this.setProperty('tooltip', this.widget.tooltip ?? null);
    this.setProperty('isFill', this.widget.isFill);
    this.setProperty('isSmall', this.widget.isSmall);
    this.setProperty('arrow', this.widget.arrow);
  }

  private onTextChanged(value: string): void {
    this.widget!.text = value;
    this.update.emit();
  }

  private onTooltipChanged(value: string | null): void {
    if (value && value.trim().length === 0) {
      value = null;
    }
    this.widget!.tooltip = value ?? undefined;
    this.update.emit();
  }

  private onIsFillChanged(value: boolean): void {
    this.widget!.isFill = value;
    if (value) {
      this.resetIsSmall();
      this.resetArrow();
    }
    this.update.emit();
  }

  private onIsSmallChanged(value: boolean): void {
    this.widget!.isSmall = value;
    if (value) {
      this.resetIsFill();
      this.resetArrow();
    }
    this.update.emit();
  }

  private onArrowChanged(value: FIGDir): void {
    this.widget!.arrow = value;
    if (value) {
      this.resetIsFill();
      this.resetIsSmall();
    }
    this.update.emit();
  }

  private resetIsFill(): void {
    if (!this.widget!.isFill) {
      return;
    }
    this.setProperty('isFill', false);
    this.widget!.isFill = false;
  }

  private resetIsSmall(): void {
    if (!this.widget!.isSmall) {
      return;
    }
    this.setProperty('isSmall', false);
    this.widget!.isSmall = false;
  }

  private resetArrow(): void {
    if (this.widget!.arrow === FIGDir.none) {
      return;
    }
    this.setProperty('arrow', FIGDir.none);
    this.widget!.arrow = FIGDir.none;
  }

}
