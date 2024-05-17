import {FIGBaseDocumentParser} from "../document.parser";
import {FIGDocumentJsonReader} from "./document-json.reader";
import {FIGDocumentJsonWriter} from "./document-json.writer";

export class FIGDocumentJsonParser extends FIGBaseDocumentParser<FIGDocumentJsonReader, FIGDocumentJsonWriter> {

  constructor() {
    super(new FIGDocumentJsonReader(), new FIGDocumentJsonWriter());
  }

}
