import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {FIGTemplateParser} from "../parsers/template.parser";
import {FIGTemplateEntity} from "../entities/template.entity";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly parser: FIGTemplateParser;

  constructor() {
    this.parser = new FIGTemplateParser();
  }

  public read(file: File): Observable<FIGTemplateEntity> {
    return fromPromise(this.parser.read(file));
  }

  public write(template: FIGTemplateEntity): Observable<File> {
    return fromPromise(this.parser.write(template));
  }

}
