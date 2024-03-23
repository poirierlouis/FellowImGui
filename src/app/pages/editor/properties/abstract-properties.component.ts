import {Component, DestroyRef, EventEmitter, Input, OnDestroy, Output} from "@angular/core";
import {FIGWidget} from "../../../models/widgets/widget";
import {debounceTime, map, Observable, Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface FlagItem<T> {
  readonly label: string;
  readonly value: T;
}

@Component({
  template: ''
})
export abstract class AbstractPropertiesComponent<T extends FIGWidget> implements OnDestroy {

  @Output()
  update: EventEmitter<FIGWidget> = new EventEmitter<FIGWidget>();

  widget!: T;
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

  protected getProperty<T>(property: string): T {
    return this.form.get(property)!.value;
  }

  protected setProperty(property: string, value: any): void {
    this.form.get(property)!.setValue(value, {emitEvent: false});
  }

  protected disableProperty(property: string): void {
    this.form.get(property)!.disable({emitEvent: false});
  }

  protected enableProperty(property: string): void {
    this.form.get(property)!.enable({emitEvent: false});
  }

  protected testProperty(property: string): boolean {
    return this.form.get(property)!.valid;
  }

  protected load(): void {
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
