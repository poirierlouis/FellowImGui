import {FIGDocumentWriter, FIGDocumentWriterError, FIGDocumentWriterErrorCode} from "../document.writer";
import {FIGWidget} from "../../models/widgets/widget";
import {FIGContainer} from "../../models/widgets/container";
import {FIGDocument} from "../../models/document";
import {FIGBaseDocumentParser, FIGSerializeBind, FIGSerializeProperty} from "../document.parser";
import {FIGDocumentJsonKeyGenerator} from "./document-json.parser";
import {FIGStylesSerializers} from "../../models/document-styles";

export class FIGDocumentJsonWriter extends FIGDocumentWriter {
  private readonly writers: FIGSerializeBind[] = FIGBaseDocumentParser.binders;

  public override async write(document: FIGDocument): Promise<File> {
    try {
      const data: any = this.serializeDocument(document);
      const json: string = JSON.stringify(data);

      return new File([json], 'new-document.mj.fig', {type: 'application/json'});
    } catch (e) {
      const error: any = e;

      throw new FIGDocumentWriterError(error.code, error.type);
    }
  }

  private serializeDocument(document: FIGDocument): any {
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const data: any = {};

    data[keygen.next()] = document.version;
    data[keygen.next()] = document.root.map((container) => this.serializeWidget(container));
    data[keygen.next()] = this.serializeObject(document.styles, FIGStylesSerializers);
    return data;
  }

  private serializeObject(object: any, serializers: FIGSerializeProperty[]): any {
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const json: any = {};

    for (const serialize of serializers) {
      const value: any | undefined = this.serializeProperty(object, serialize);
      const key: string = keygen.next();

      if (value !== undefined) {
        json[key] = value;
      }
    }
    return json;
  }

  private serializeWidget(widget: FIGWidget): any | undefined {
    const writer: FIGSerializeBind | undefined = this.writers.find((writer) => writer.type === widget.type);

    if (!writer) {
      throw {code: FIGDocumentWriterErrorCode.TypeNotImplemented, type: widget.type};
    }
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const serializers: FIGSerializeProperty[] = writer.constructor['serializers'] ?? [];
    const data: any = {};

    data[keygen.next()] = widget.type;
    //data[generator.next()] = widget.uuid; // NOTE: field not required for now.
    for (const serializer of serializers) {
      const value: any | undefined = this.serializeProperty(widget, serializer);
      const key: string = keygen.next();

      if (value !== undefined) {
        data[key] = value;
      }
    }
    if (widget instanceof FIGContainer) {
      data[keygen.next()] = widget.children.map((child) => this.serializeWidget(child));
    }
    return data;
  }

  private serializeProperty(object: any, serializer: FIGSerializeProperty): any {
    const value: any = object[serializer.name];

    if (serializer.optional && value === serializer.default) {
      if (serializer.type === 'array' && value.length === serializer.default.length) {
        return undefined;
      } else if (value === serializer.default) {
        return undefined;
      }
    }
    if (serializer.type === 'object' && serializer.innerType) {
      const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
      const innerValue: any = {};

      for (const innerSerializer of serializer.innerType) {
        const innerProperty: any | undefined = this.serializeProperty(value, innerSerializer);
        const key: string = keygen.next();

        if (innerProperty !== undefined) {
          innerValue[key] = innerProperty;
        }
      }
      return innerValue;
    }
    return value;
  }

}
