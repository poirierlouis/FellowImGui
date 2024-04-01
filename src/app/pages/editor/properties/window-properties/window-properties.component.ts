import {Component, DestroyRef} from '@angular/core';
import {FIGCondFlags, FIGWindowFlags, FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AbstractPropertiesComponent, FlagItem} from "../abstract-properties.component";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'fig-window-properties',
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './window-properties.component.html',
  styleUrl: './window-properties.component.css'
})
export class WindowPropertiesComponent extends AbstractPropertiesComponent<FIGWindowWidget> {

  readonly sizeFlags: FlagItem<FIGCondFlags>[] = [];
  readonly flags: FlagItem<FIGWindowFlags>[] = [];

  override form: FormGroup = new FormGroup<any>({
    label: new FormControl<string>(''),
    forceSize: new FormControl<boolean>(false),
    width: new FormControl<number>(32, {validators: Validators.min(32)}),
    height: new FormControl<number>(32, {validators: Validators.min(32)}),
    minWidth: new FormControl<number | null>(null, {validators: Validators.min(0)}),
    minHeight: new FormControl<number | null>(null, {validators: Validators.min(0)}),
    sizeFlags: new FormControl<string[]>([]),
    flags: new FormControl<string[]>([]),
  });

  constructor(dr: DestroyRef) {
    super(dr);
    for (const flag of FIGWindowWidget.condFlags) {
      this.sizeFlags.push({
        label: FIGCondFlags[flag],
        value: flag
      });
    }
    for (const flag of FIGWindowWidget.flags) {
      this.flags.push({
        label: FIGWindowFlags[flag],
        value: flag
      });
    }
    this.listenProperty('label').subscribe(this.onLabelChanged.bind(this));
    this.listenProperty('forceSize').subscribe(this.onForceSizeChanged.bind(this));
    this.listenProperty('width', 300).subscribe(this.onWidthChanged.bind(this));
    this.listenProperty('height', 300).subscribe(this.onHeightChanged.bind(this));
    this.listenProperty('sizeFlags').subscribe(this.onSizeFlagsChanged.bind(this));
    this.listenProperty('minWidth', 300).subscribe(this.onMinWidthChanged.bind(this));
    this.listenProperty('minHeight', 300).subscribe(this.onMinHeightChanged.bind(this));
    this.listenProperty('flags').subscribe(this.onFlagsChanged.bind(this));
  }

  protected override updateForm(): void {
    this.setProperty('label', this.widget.label);
    this.setProperty('forceSize', !!this.widget.size);
    this.setProperty('width', this.widget.size?.width ?? null);
    this.setProperty('height', this.widget.size?.height ?? null);
    if (this.widget.size) {
      this.enableProperty('width');
      this.enableProperty('height');
    } else {
      this.disableProperty('width');
      this.disableProperty('height');
    }
    const sizeFlags: number[] = [];

    for (const flag of this.sizeFlags) {
      if ((this.widget.sizeFlags & flag.value) === flag.value) {
        sizeFlags.push(flag.value);
      }
    }
    this.setProperty('sizeFlags', sizeFlags);
    this.setProperty('minWidth', this.widget.minSize?.width ?? null);
    this.setProperty('minHeight', this.widget.minSize?.height ?? null);
    const flags: number[] = [];

    for (const flag of this.flags) {
      if ((this.widget.flags & flag.value) === flag.value) {
        flags.push(flag.value);
      }
    }
    this.setProperty('flags', flags);
  }

  private onLabelChanged(value: string): void {
    this.widget.label = value;
    this.update.emit();
  }

  private onForceSizeChanged(value: boolean): void {
    if (value) {
      this.widget.size = {
        width: this.getProperty('width'),
        height: this.getProperty('height')
      };
      this.enableProperty('width');
      this.enableProperty('height');
    } else {
      this.widget.size = undefined;
      this.disableProperty('width');
      this.disableProperty('height');
    }
    this.update.emit();
  }

  private onWidthChanged(value: number): void {
    if (!this.widget.size) {
      this.widget.size = {width: value, height: 0};
    } else {
      this.widget.size.width = value;
    }
    this.update.emit();
  }

  private onHeightChanged(value: number): void {
    if (!this.widget.size) {
      this.widget.size = {width: 0, height: value};
    } else {
      this.widget.size.height = value;
    }
    this.update.emit();
  }

  private onMinWidthChanged(value: number | null): void {
    if (!this.testProperty('minWidth')) {
      this.setProperty('minWidth', this.widget.minSize?.width ?? null);
      return;
    }
    value ??= 0;
    if (!this.widget.minSize) {
      this.widget.minSize = {width: value, height: 0};
    } else {
      this.widget.minSize.width = value;
    }
    if (this.widget.minSize.width === 0 && this.widget.minSize.height === 0) {
      this.widget.minSize = undefined;
    }
    this.update.emit();
  }

  private onMinHeightChanged(value: number | null): void {
    if (!this.testProperty('minHeight')) {
      this.setProperty('minHeight', this.widget.minSize?.height ?? null);
      return;
    }
    value ??= 0;
    if (!this.widget.minSize) {
      this.widget.minSize = {width: 0, height: value};
    } else {
      this.widget.minSize.height = value;
    }
    if (this.widget.minSize.width === 0 && this.widget.minSize.height === 0) {
      this.widget.minSize = undefined;
    }
    this.update.emit();
  }

  private onSizeFlagsChanged(value: number[]): void {
    for (const flag of this.sizeFlags) {
      const isEnabled: boolean = value.includes(flag.value);

      if (isEnabled) {
        this.widget.sizeFlags |= flag.value;
      } else if ((this.widget.sizeFlags & flag.value) === flag.value) {
        this.widget.sizeFlags ^= flag.value;
      }
    }
    this.update.emit();
  }

  private onFlagsChanged(value: number[]): void {
    for (const flag of this.flags) {
      const isEnabled: boolean = value.includes(flag.value);

      if (isEnabled) {
        this.widget.flags |= flag.value;
      } else if ((this.widget.flags & flag.value) === flag.value) {
        this.widget.flags ^= flag.value;
      }
    }
    if ((this.widget.flags & FIGWindowFlags.AlwaysAutoResize) === FIGWindowFlags.AlwaysAutoResize) {
      this.widget.size = undefined;
      this.disableProperty('width');
      this.disableProperty('height');
    } else {
      this.enableProperty('width');
      this.enableProperty('height');
    }
    this.update.emit();
  }

}
