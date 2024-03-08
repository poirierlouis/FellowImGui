import {Component, DestroyRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FIGWindowWidget} from "../../../../models/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FIGWidget} from "../../../../models/widget";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subscription} from "rxjs";

@Component({
  selector: 'fig-window-settings',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './window-settings.component.html',
  styleUrl: './window-settings.component.css'
})
export class WindowSettingsComponent implements OnDestroy {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: FIGWindowWidget;

  form: FormGroup = new FormGroup<any>({
    title: new FormControl<string>(''),
    width: new FormControl<number>(32, {validators: [Validators.min(32)]}),
    height: new FormControl<number>(32, {validators: [Validators.min(32)]})
  });

  private updateS?: Subscription;

  constructor(private readonly dr: DestroyRef) {
    this.form.get('title')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onTitleChanged.bind(this));
    this.form.get('width')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onWidthChanged.bind(this));
    this.form.get('height')!.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onHeightChanged.bind(this));
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.widget = value as FIGWindowWidget;
    this.updateS?.unsubscribe();
    this.updateS = this.widget.update$.subscribe(this.onUpdated.bind(this));
    this.load();
  }

  public ngOnDestroy(): void {
    this.updateS?.unsubscribe();
  }

  private load(): void {
    this.form.get('title')!.setValue(this.widget.title, {emitEvent: false});
    this.form.get('width')!.setValue(this.widget.size.width, {emitEvent: false});
    this.form.get('height')!.setValue(this.widget.size.height, {emitEvent: false});
  }

  private onTitleChanged(value: string): void {
    this.widget.title = value;
    this.update.emit();
  }

  private onWidthChanged(value: number): void {
    if (!this.form.get('width')!.valid) {
      return;
    }
    this.widget.size.width = value;
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.form.get('height')!.valid) {
      return;
    }
    this.widget.size.height = value;
    this.update.emit();
  }

  private onUpdated(): void {
    this.load();
  }

}
