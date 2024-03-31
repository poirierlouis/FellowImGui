import {FIGDocument} from "../models/document";
import {FIGWidgetType} from "../models/widgets/widget";

export abstract class FIGDocumentReader {

  public abstract read(file: File): Promise<FIGDocument>;

}

export enum FIGDocumentReaderErrorCode {
  ExpectContainer,
  TypeNotImplemented
}

export class FIGDocumentReaderError extends Error {

  constructor(public readonly code: FIGDocumentReaderErrorCode,
              public readonly type?: FIGWidgetType) {
    super();
  }

}
