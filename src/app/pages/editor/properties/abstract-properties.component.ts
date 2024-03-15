import {Component, DestroyRef, Input, OnDestroy} from "@angular/core";
import {FIGWidget} from "../../../models/widgets/widget";
import {debounceTime, map, Observable, Subscription} from "rxjs";
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

  protected listenProperty(property: string, debounce?: number): Observable<any> {
    return this.form.get(property)!.valueChanges.pipe(
      (debounce) ? debounceTime(debounce) : map((_) => _),
      takeUntilDestroyed(this.dr)
    );
  }

  protected setProperty(property: string, value: any): void {
    this.form.get(property)!.setValue(value, {emitEvent: false});
  }

  protected load(): void {
    if (!this.widget) {
      return;
    }
    this.updateS = this.widget.update$.subscribe(this.onUpdated.bind(this));
    this.updateForm();
  }

  protected abstract updateForm(): void;

  protected dispose(): void {
    this.updateS?.unsubscribe();
  }

  protected onUpdated(): void {
    this.updateForm();
  }

}
