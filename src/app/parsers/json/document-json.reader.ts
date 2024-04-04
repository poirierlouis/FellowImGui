import {FIGDocument} from "../../models/document";
import {FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
import {FIGDocumentReader, FIGDocumentReaderError, FIGDocumentReaderErrorCode} from "../document.reader";
import {FIGContainer} from "../../models/widgets/container";
import {FIGDocumentJsonKeyGenerator} from "./document-json.parser";
import {FIGBaseDocumentParser, FIGSerializeBind, FIGSerializeProperty, Versioning} from "../document.parser";
import {FIGStyles, FIGStylesSerializers} from "../../models/document-styles";

export class FIGDocumentJsonReader extends FIGDocumentReader {
  private readonly readers: FIGSerializeBind[] = FIGBaseDocumentParser.binders;
  private readonly versions: Versioning = FIGBaseDocumentParser.versioning;

  public override async read(file: File): Promise<FIGDocument> {
    const data: string = await file.text();

    try {
      const json: any = JSON.parse(data);

      return this.readDocument(json);
    } catch (e) {
      const error: any = e;

      throw new FIGDocumentReaderError(error.code, error.type);
    }
  }

  private readDocument(data: any): FIGDocument {
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const document: FIGDocument = new FIGDocument();
    const jsonVersion: string = data[keygen.next()];
    const jsonRoot: any[] = data[keygen.next()];
    const version: number = this.versions[jsonVersion];

    for (const jsonContainer of jsonRoot) {
      const container: FIGWidget = this.readWidget(jsonContainer, version);

      if (!(container instanceof FIGContainer)) {
        throw {code: FIGDocumentReaderErrorCode.ExpectContainer, type: container.type};
      }
      document.root.push(container);
    }
    const jsonStyles: FIGStyles | undefined = this.readObject(data[keygen.next()], FIGStylesSerializers, version);

    if (jsonStyles) {
      document.styles = jsonStyles;
    }
    return document;
  }

  private readObject(json: any, serializers: FIGSerializeProperty[], version: number): any | undefined {
    if (json === undefined) {
      return undefined;
    }
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const object: any = {};

    serializers = serializers.filter((serializer) => (serializer.version ?? 0) <= version);
    for (const serializer of serializers) {
      const key: string = keygen.next();
      const value: any | undefined = this.readProperty(key, json, serializer);

      if (value !== undefined) {
        object[serializer.name] = value;
      }
    }
    return object;
  }

  private readWidget(json: any, version: number): FIGWidget {
    const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
    const type: FIGWidgetType = json[keygen.next()];
    const reader: FIGSerializeBind | undefined = this.readers.find((reader) => reader.type === type);

    if (!reader) {
      throw {code: FIGDocumentReaderErrorCode.TypeNotImplemented, type: type};
    }
    //keygen.next(); // skip uuid
    let serializers: FIGSerializeProperty[] = reader.constructor['serializers'] ?? [];

    serializers = serializers.filter((serializer) => (serializer.version ?? 0) <= version);
    const options: any = {};

    for (const serializer of serializers) {
      const key: string = keygen.next();
      const value: any | undefined = this.readProperty(key, json, serializer);

      if (value !== undefined) {
        options[serializer.name] = value;
      }
    }
    const widget: FIGWidget = new reader.constructor(options);

    if (widget instanceof FIGContainer) {
      const children: any[] = json[keygen.next()];

      widget.children.push(...children.map((child) => this.readWidget(child, version)));
    }
    return widget;
  }

  private readProperty(key: string, json: any, serializer: FIGSerializeProperty): any {
    if (!(key in json)) {
      return undefined;
    }
    if (serializer.type === 'object' && serializer.innerType) {
      const keygen: FIGDocumentJsonKeyGenerator = new FIGDocumentJsonKeyGenerator();
      const innerJson: any = json[key];
      const innerValue: any = {};

      for (const innerSerializer of serializer.innerType) {
        const innerKey: string = keygen.next();
        const innerProperty: any | undefined = this.readProperty(innerKey, innerJson, innerSerializer);

        if (innerProperty !== undefined) {
          innerValue[innerSerializer.name] = innerProperty;
        }
      }
      return innerValue;
    }
    return json[key];
  }

}
