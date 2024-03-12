import {Component, DestroyRef, Input, OnDestroy} from "@angular/core";
import {FIGWidget} from "../../../models/widgets/widget";
import {debounceTime, Observable, Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  template: ''
})
export abstract class AbstractPropertiesComponent<T extends FIGWidget> implements OnDestroy {

  widget?: T;

  form!: FormGroup;

  private updateS?: Subscription;

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

  protected listenProperty(property: string): Observable<any> {
    return this.form.get(property)!.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.dr)
    );
  }

  protected load(): void {
    if (!this.widget) {
      return;
    }
    this.widget!.isFocused = true;
    this.updateS = this.widget.update$.subscribe(this.onUpdated.bind(this));
    this.updateForm();
  }

  protected abstract updateForm(): void;

  protected dispose(): void {
    if (this.widget) {
      this.widget.isFocused = false;
    }
    this.updateS?.unsubscribe();
  }

  protected onUpdated(): void {
    this.updateForm();
  }

}
