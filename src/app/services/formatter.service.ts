import {Injectable} from "@angular/core";
import {FIGFormatter, FIGFormatterLanguage} from "../formatters/formatter";
import {FIGLuaFormatter} from "../formatters/lua.formatter";
import {FIGDocument} from "../models/document";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  private formatter?: FIGFormatter;
  private language?: FIGFormatterLanguage;

  constructor() {
    this.formatter = new FIGLuaFormatter();
    this.language = 'lua';
  }

  public format(document: FIGDocument): string | undefined {
    return this.formatter?.format(document);
  }

}
