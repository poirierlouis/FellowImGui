import {Injectable} from "@angular/core";
import type {Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import type {FIGDocument} from "../models/document";
import type {FIGDocumentParser} from "../parsers/document.parser";
import {FIGDocumentJsonParser} from "../parsers/json/document-json.parser";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private parser: FIGDocumentParser;

  constructor() {
    this.parser = new FIGDocumentJsonParser();
  }

  public read(file: File): Observable<FIGDocument> {
    // TODO: select parser based on file extension.
    return fromPromise(this.parser.read(file));
  }

  public write(document: FIGDocument): Observable<File> {
    return fromPromise(this.parser.write(document));
  }
}
