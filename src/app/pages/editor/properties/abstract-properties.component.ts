import {Component, DestroyRef, EventEmitter, Input, OnDestroy, Output} from "@angular/core";
import {FIGWidget} from "../../../models/widgets/widget";
import {FormGroup} from "@angular/forms";
import {Field} from "../../../models/fields/field";
import {hasFunction} from "../../../models/object";
import {capitalize} from "../../../models/string";

@Component({
    template: '',
    standalone: false
})
export abstract class AbstractPropertiesComponent<T extends FIGWidget> implements OnDestroy {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: T;
  form!: FormGroup;

  protected constructor(protected readonly dr: DestroyRef) {
  }

  @Input('widget')
  set _widget(value: FIGWidget) {
    this.dispose();
    this.widget = value as T;
    this.load();
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected getField<T = unknown>(name: string): Field<T> {
    return this.widget.getField(name) as Field<T>;
  }

  protected updateWidget(): void {
    this.update.emit(this.widget);
  }

  // Can be overridden
  protected load(): void {
    this.addFieldListeners();
  }

  // Can be overridden
  protected dispose(): void {
    this.removeFieldListeners();
  }

  private addFieldListeners(): void {
    if (!this.widget) {
      return;
    }
    for (const field of this.widget.getFields()) {
      const name: string = `on${capitalize(field.name)}Changed`;

      if (hasFunction(this, name)) {
        field.addListener(this.getListener(name));
      }
    }
  }

  private removeFieldListeners(): void {
    if (!this.widget) {
      return;
    }
    for (const field of this.widget.getFields()) {
      const name: string = `on${capitalize(field.name)}Changed`;

      if (hasFunction(this, name)) {
        field.removeListener(this.getListener(name));
      }
    }
  }

  private getListener(name: string): () => void {
    return ((this as never)[name] as () => void).bind(this);
  }

}
