import {Injectable} from "@angular/core";
import {FIGFormatter, FIGFormatterLanguage} from "../formatters/formatter";
import {FIGLuaFormatter} from "../formatters/lua.formatter";
import {FIGDocument} from "../models/document";
import {FIGWidgetType} from "../models/widgets/widget";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  private formatter?: FIGFormatter;

  constructor() {
    this.formatter = new FIGLuaFormatter();
  }

  public get currentLanguage(): FIGFormatterLanguage | undefined {
    return this.formatter?.language;
  }

  public format(document: FIGDocument): string | undefined {
    return this.formatter?.format(document);
  }

  public isSupported(type: FIGWidgetType): boolean {
    return this.formatter?.isSupported(type) ?? false;
  }

}
