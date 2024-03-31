import {FIGBaseDocumentParser} from "../document.parser";
import {FIGDocumentJsonReader} from "./document-json.reader";
import {FIGDocumentJsonWriter} from "./document-json.writer";

export class FIGDocumentJsonParser extends FIGBaseDocumentParser<FIGDocumentJsonReader, FIGDocumentJsonWriter> {

  constructor() {
    super(new FIGDocumentJsonReader(), new FIGDocumentJsonWriter());
  }

}

export class FIGDocumentJsonKeyGenerator {
  private static readonly keys: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private index: number = 0;

  public next(): string {
    return FIGDocumentJsonKeyGenerator.keys[this.index++];
  }

}
