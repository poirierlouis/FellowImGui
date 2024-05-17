import {FIGDocumentWriter, FIGDocumentWriterError, FIGDocumentWriterErrorCode} from "../document.writer";
import {FIGWidget} from "../../models/widgets/widget";
import {FIGContainer} from "../../models/widgets/container";
import {FIGDocument} from "../../models/document";
import {FIGBaseDocumentParser, FIGSerializeBind, FIGSerializeProperty} from "../document.parser";
import {FIGConfigSerializers} from "../../models/document-config";
import {FIGJsonWriter} from "./writer.json";
import {FIGJsonKeygen} from "./keygen.json";

export class FIGDocumentJsonWriter extends FIGDocumentWriter {
  private readonly writers: FIGSerializeBind[] = FIGBaseDocumentParser.binders;

  public override async write(document: FIGDocument): Promise<File> {
    try {
      const data: any = this.writeDocument(document);
      const json: string = JSON.stringify(data);

      return new File([json], 'document.fig', {type: 'application/json'});
    } catch (e) {
      const error: any = e;

      throw new FIGDocumentWriterError(error.code, error.type);
    }
  }

  private writeDocument(document: FIGDocument): any {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const data: any = {};

    data[keygen.next()] = document.version;
    data[keygen.next()] = document.root.map((container) => this.serializeWidget(container));
    data[keygen.next()] = FIGJsonWriter.writeObject(document.config, FIGConfigSerializers);
    return data;
  }

  private serializeWidget(widget: FIGWidget): any | undefined {
    const writer: FIGSerializeBind | undefined = this.writers.find((writer) => writer.type === widget.type);

    if (!writer) {
      throw {code: FIGDocumentWriterErrorCode.TypeNotImplemented, type: widget.type};
    }
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const serializers: FIGSerializeProperty[] = writer.constructor['serializers'] ?? [];
    const data: any = {};

    data[keygen.next()] = widget.type;
    //data[generator.next()] = widget.uuid; // NOTE: field not required for now.
    for (const serializer of serializers) {
      const value: any | undefined = FIGJsonWriter.writeProperty(widget, serializer);
      const key: string = keygen.next();

      if (value !== undefined) {
        data[key] = serializer.write?.(value) ?? value;
      }
    }
    if (widget instanceof FIGContainer) {
      data[keygen.next()] = widget.children.map((child) => this.serializeWidget(child));
    }
    return data;
  }

}
