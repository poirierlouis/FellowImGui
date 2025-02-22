import {FIGDocument} from "../../models/document";
import {FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
import {FIGDocumentReader, FIGDocumentReaderError, FIGDocumentReaderErrorCode} from "../document.reader";
import {FIGContainer} from "../../models/widgets/container";
import {FIGBaseDocumentParser, FIGSerializeBind, FIGSerializeProperty, Versioning} from "../document.parser";
import {FIGConfig, FIGConfigSerializers} from "../../models/document-config";
import {FIGJsonKeygen} from "./keygen.json";
import {FIGJsonReader} from "./reader.json";

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
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
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
    const jsonStyles: FIGConfig | undefined = FIGJsonReader.readObject(data[keygen.next()], FIGConfigSerializers, version);

    if (jsonStyles) {
      document.config = jsonStyles;
    }
    return document;
  }

  private readWidget(json: any, version: number): FIGWidget {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
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
      const value: any | undefined = FIGJsonReader.readProperty(key, json, serializer);

      if (value !== undefined) {
        options[serializer.name] = serializer.read?.(value) ?? value;
      }
    }
    const widget: FIGWidget = new reader.constructor(options);

    if (widget instanceof FIGContainer) {
      const children: any[] = json[keygen.next()];

      widget.children.push(...children.map((child) => this.readWidget(child, version)));
    }
    return widget;
  }

}
