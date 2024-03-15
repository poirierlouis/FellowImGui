import {Injectable} from "@angular/core";
import {FIGFormatter} from "../formatters/formatter";
import {FIGLuaFormatter} from "../formatters/lua.formatter";
import {FIGDocument} from "../models/document";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  private formatter?: FIGFormatter;

  constructor() {
    this.formatter = new FIGLuaFormatter();
  }

  public format(document: FIGDocument): string | undefined {
    return this.formatter?.format(document);
  }

}
