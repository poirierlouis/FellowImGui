import type {FIGDocument} from "../models/document";
import type {FIGWidgetType} from "../models/widgets/widget";

export abstract class FIGDocumentReader {
  public abstract read(file: File): Promise<FIGDocument>;
}

export enum FIGDocumentReaderErrorCode {
  ExpectContainer,
  TypeNotImplemented,
  VersionNotFound,
  VersionUnknown,
  FieldRequired,
}

export class FIGDocumentReaderError extends Error {
  constructor(
    public readonly code: FIGDocumentReaderErrorCode,
    public readonly type?: FIGWidgetType,
    public readonly error?: string,
  ) {
    super();
  }
}
