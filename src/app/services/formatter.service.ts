import {Injectable} from "@angular/core";
import {FIGFormatter, FIGFormatterLanguage} from "../formatters/formatter";
import {FIGLuaSol2Formatter} from "../formatters/lua-sol2.formatter";
import {FIGDocument} from "../models/document";
import {FIGWidget, FIGWidgetType} from "../models/widgets/widget";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  private readonly formatters: FIGFormatter[];

  private readonly formatterSubject: BehaviorSubject<FIGFormatter | undefined> = new BehaviorSubject<FIGFormatter | undefined>(undefined);
  private readonly formatter$: Observable<FIGFormatter | undefined> = this.formatterSubject.asObservable();

  constructor() {
    this.formatters = [
      new FIGLuaSol2Formatter()
    ];
    this.changeLanguage('Lua - sol2');
  }

  public get currentLanguage(): FIGFormatterLanguage | undefined {
    return this.formatterSubject.value?.language;
  }

  private get formatter(): FIGFormatter | undefined {
    return this.formatterSubject.value;
  }

  public changeLanguage(language: FIGFormatterLanguage): void {
    const formatter: FIGFormatter | undefined = this.formatters.find((formatter) => formatter.language === language);

    if (!formatter) {
      return;
    }
    this.formatterSubject.next(formatter);
  }

  public format(document: FIGDocument): string | undefined {
    // TODO: create a deep copy of document to prevent formatter from mutating widgets.
    return this.formatter?.format(document);
  }

  public formatWidget(widget: FIGWidget): string | undefined {
    // TODO: create a deep copy of widget to prevent formatter from mutating widgets.
    return this.formatter?.format(widget);
  }

  public isSupported(type: FIGWidgetType): Observable<boolean> {
    return this.formatter$.pipe(
      map((formatter) => formatter?.isSupported(type) ?? false)
    );
  }

  public useLegacyFallback(type: FIGWidgetType): Observable<boolean> {
    return this.formatter$.pipe(
      map((formatter) => formatter?.useLegacyFallback(type) ?? false)
    );
  }

}
