import {FIGDocument} from "../models/document";
import {FIGWidgetType} from "../models/widgets/widget";

export abstract class FIGDocumentWriter {

  public abstract write(document: FIGDocument): Promise<File>;

}

export enum FIGDocumentWriterErrorCode {
  TypeNotImplemented
}

export class FIGDocumentWriterError extends Error {

  constructor(public readonly code: FIGDocumentWriterErrorCode,
              public readonly type?: FIGWidgetType) {
    super();
  }

}
