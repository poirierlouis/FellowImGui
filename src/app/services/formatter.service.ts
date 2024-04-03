import {Injectable} from "@angular/core";
import {FIGFormatter, FIGFormatterLanguage} from "../formatters/formatter";
import {FIGLuaSol2Formatter} from "../formatters/lua-sol2.formatter";
import {FIGDocument} from "../models/document";
import {FIGWidgetType} from "../models/widgets/widget";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  private formatter?: FIGFormatter;

  constructor() {
    this.formatter = new FIGLuaSol2Formatter();
  }

  public get currentLanguage(): FIGFormatterLanguage | undefined {
    return this.formatter?.language;
  }

  public format(document: FIGDocument): string | undefined {
    // TODO: create a deep copy of document to prevent formatter from mutating widgets.
    return this.formatter?.format(document);
  }

  public isSupported(type: FIGWidgetType): boolean {
    return this.formatter?.isSupported(type) ?? false;
  }

  public useLegacyFallback(type: FIGWidgetType): boolean {
    return this.formatter?.useLegacyFallback(type) ?? false;
  }

}
