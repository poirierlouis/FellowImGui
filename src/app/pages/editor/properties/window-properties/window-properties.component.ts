import {Component} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FIGWindowFlags, type FIGWindowWidget} from "../../../../models/widgets/window.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {SizeFieldComponent} from "../../fields/size-field/size-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-window-properties",
  imports: [
    MatLabel,
    MatSlideToggle,
    SizeFieldComponent,
    FlagsFieldComponent,
    ReactiveFormsModule,
    StringFieldComponent,
  ],
  templateUrl: "./window-properties.component.html",
  styleUrl: "./window-properties.component.css",
})
export class WindowPropertiesComponent extends AbstractPropertiesComponent<FIGWindowWidget> {
  readonly forceSize: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  protected override load(): void {
    super.load();
    const hasSize: boolean = !!this.widget.size;

    this.forceSize.setValue(hasSize, {emitEvent: false});
    this.forceSize.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(this.onForceSizeChanged.bind(this));
    if (hasSize) {
      this.getField("size").enable();
    } else {
      this.getField("size").disable();
    }
  }

  private onForceSizeChanged(value: boolean): void {
    if (value) {
      this.getField("size").enable();
    } else {
      this.widget.size = undefined;
      this.getField("size").disable();
    }
  }

  /*
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
  */

  private onFlagsChanged(flags: number): void {
    if ((flags & FIGWindowFlags.AlwaysAutoResize) === FIGWindowFlags.AlwaysAutoResize) {
      this.widget.size = undefined;
      this.forceSize.setValue(false, {emitEvent: false});
      this.getField("size").disable();
    } else {
      this.getField("size").enable();
    }
  }
}
