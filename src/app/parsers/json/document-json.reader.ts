import {FIGDocument} from "../../models/document";
import {type FIGConfig, FIGConfigSerializers} from "../../models/document-config";
import {FIGContainer} from "../../models/widgets/container";
import {type FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
import {
  FIGBaseDocumentParser,
  type FIGSerializeProperty,
  type FIGWidgetConstructors,
  type Versioning,
} from "../document.parser";
import {FIGDocumentReader, FIGDocumentReaderError, FIGDocumentReaderErrorCode} from "../document.reader";
import {FIGJsonKeygen} from "./keygen.json";
import {FIGJsonReader} from "./reader.json";

type ReaderCallback = (data: any) => FIGDocument;

export class FIGDocumentJsonReader extends FIGDocumentReader {
  private readonly constructors: FIGWidgetConstructors = FIGBaseDocumentParser.constructors;
  private readonly placeholders: Record<FIGWidgetType, FIGWidget> = FIGBaseDocumentParser.placeholders;
  private readonly versions: Versioning = FIGBaseDocumentParser.versioning;

  private readonly readers: Record<string, ReaderCallback> = {
    "0.2.0": this.readDocumentV0_2_0.bind(this),
    "0.1.0": this.readDocumentV0_1_0.bind(this),
    "0.0.0": this.readDocumentV0_1_0.bind(this),
  };

  public override async read(file: File): Promise<FIGDocument> {
    const data: string = await file.text();
    const json: any = JSON.parse(data);
    const version: string = this.detectVersion(json);
    const reader: ReaderCallback | undefined = this.readers[version];
    if (!reader) {
      throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.VersionUnknown);
    }

    return reader(json);
  }

  private detectVersion(json: any): string {
    if ("a" in json) {
      return json.a;
    } else if ("version" in json) {
      return json.version;
    } else {
      throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.VersionNotFound);
    }
  }

  /// 0.2.0 ///

  private readDocumentV0_2_0(data: any): FIGDocument {
    const document = new FIGDocument();

    for (const json of data.containers) {
      const container: FIGWidget = this.readWidgetV0_2_0(json);
      if (!(container instanceof FIGContainer)) {
        throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.ExpectContainer, container.type);
      }
      document.root.push(container);
    }

    // TODO: read document.config
    return document;
  }

  private readWidgetV0_2_0(json: any): FIGWidget {
    const type: FIGWidgetType = FIGWidgetType[json.type as keyof typeof FIGWidgetType];
    const ctor = this.constructors[type];
    const placeholder = this.placeholders[type];
    if (!ctor || !placeholder) {
      throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.TypeNotImplemented, type);
    }

    const options: any = {};
    for (const field of placeholder.getFields()) {
      if (field.isRequired && !(field.name in json)) {
        throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.FieldRequired, type, field.name);
      }
      if (!(field.name in json)) {
        continue;
      }
      options[field.name] = json[field.name];
    }
    const widget: FIGWidget = new ctor(options);
    if (
      widget instanceof FIGContainer &&
      "children" in json &&
      Array.isArray(json.children) &&
      json.children.length > 0
    ) {
      for (const jsonChild of json.children) {
        const child: FIGWidget = this.readWidgetV0_2_0(jsonChild);
        widget.children.push(child);
      }
    }

    return widget;
  }

  /// 0.1.0 ///

  private readDocumentV0_1_0(data: any): FIGDocument {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const document: FIGDocument = new FIGDocument();
    const jsonVersion: string = data[keygen.next()];
    const jsonRoot: any[] = data[keygen.next()];
    const version: number = this.versions[jsonVersion];

    for (const jsonContainer of jsonRoot) {
      const container: FIGWidget = this.readWidgetV0_1_0(jsonContainer, version);

      if (!(container instanceof FIGContainer)) {
        throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.ExpectContainer, container.type);
      }
      document.root.push(container);
    }
    const jsonStyles: FIGConfig | undefined = FIGJsonReader.readObject(
      data[keygen.next()],
      FIGConfigSerializers,
      version,
    );

    if (jsonStyles) {
      document.config = jsonStyles;
    }
    return document;
  }

  private readWidgetV0_1_0(json: any, version: number): FIGWidget {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const type: FIGWidgetType = json[keygen.next()];
    const reader = this.constructors[type];
    if (!reader) {
      throw new FIGDocumentReaderError(FIGDocumentReaderErrorCode.TypeNotImplemented, type);
    }

    //keygen.next(); // skip uuid
    let serializers: FIGSerializeProperty[] = reader.serializers ?? [];

    serializers = serializers.filter((serializer) => (serializer.version ?? 0) <= version);
    const options: any = {};

    for (const serializer of serializers) {
      const key: string = keygen.next();
      const value: any | undefined = FIGJsonReader.readProperty(key, json, serializer);

      if (value !== undefined) {
        options[serializer.name] = serializer.read?.(value) ?? value;
      }
    }
    const widget: FIGWidget = new reader(options);

    if (widget instanceof FIGContainer) {
      const children: any[] = json[keygen.next()];

      widget.children.push(...children.map((child) => this.readWidgetV0_1_0(child, version)));
    }
    return widget;
  }
}
