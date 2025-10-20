import type {FIGDocument} from "../../models/document";
import {FIGConfigSerializers} from "../../models/document-config";
import {FIGContainer} from "../../models/widgets/container";
import {type FIGWidget, FIGWidgetType} from "../../models/widgets/widget";
import {FIGBaseDocumentParser, type FIGSerializeProperty, type FIGWidgetConstructors} from "../document.parser";
import {FIGDocumentWriter, FIGDocumentWriterError, FIGDocumentWriterErrorCode} from "../document.writer";
import {FIGJsonKeygen} from "./keygen.json";
import {FIGJsonWriter} from "./writer.json";

type FIGDocumentWriterCallback = (document: FIGDocument) => string;

export class FIGDocumentJsonWriter extends FIGDocumentWriter {
  private readonly constructors: FIGWidgetConstructors = FIGBaseDocumentParser.constructors;
  private readonly writers: Record<string, FIGDocumentWriterCallback> = {
    "0.2.0": this.writeDocumentV0_2_0.bind(this),
    "0.1.0": this.writeDocumentV0_1_0.bind(this),
    "0.0.0": this.writeDocumentV0_1_0.bind(this),
  };

  public override async write(document: FIGDocument): Promise<File> {
    const json: string = this.writeDocument(document);
    return new File([json], "document.fig", {type: "application/json"});
  }

  private writeDocument(document: FIGDocument): string {
    const writer = this.writers[document.version];
    if (!writer) {
      throw new FIGDocumentWriterError(FIGDocumentWriterErrorCode.VersionNotFound);
    }

    return writer(document);
  }

  /// 0.2.0 ///

  private writeDocumentV0_2_0(document: FIGDocument): string {
    const data: any = {};

    data.version = document.version;
    data.containers = document.root.map((container) => this.serializeWidgetV0_2_0(container));
    //TODO: serialize to data.config

    return JSON.stringify(data, null, 2);
  }

  private serializeWidgetV0_2_0(widget: FIGWidget): any {
    const ctor = this.constructors[widget.type];
    if (!ctor) {
      throw new FIGDocumentWriterError(FIGDocumentWriterErrorCode.TypeNotImplemented, widget.type);
    }

    const data: any = {
      type: FIGWidgetType[widget.type],
    };
    for (const field of widget.getFields()) {
      if (field.isRequired) {
        data[field.name] = field.value;
      } else if (!field.isEqual(field.defaultValue)) {
        data[field.name] = field.value;
      }
    }

    if (widget instanceof FIGContainer && widget.children.length > 0) {
      data.children = widget.children.map((child) => this.serializeWidgetV0_2_0(child));
    }

    return data;
  }

  /// 0.1.0 ///

  private writeDocumentV0_1_0(document: FIGDocument): string {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const data: any = {};

    data[keygen.next()] = document.version;
    data[keygen.next()] = document.root.map((container) => this.serializeWidgetV0_1_0(container));
    data[keygen.next()] = FIGJsonWriter.writeObject(document.config, FIGConfigSerializers);

    return JSON.stringify(data);
  }

  private serializeWidgetV0_1_0(widget: FIGWidget): any | undefined {
    const ctor = this.constructors[widget.type];
    if (!ctor) {
      throw new FIGDocumentWriterError(FIGDocumentWriterErrorCode.TypeNotImplemented, widget.type);
    }

    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const serializers: FIGSerializeProperty[] = ctor.serializers ?? [];
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
      data[keygen.next()] = widget.children.map((child) => this.serializeWidgetV0_1_0(child));
    }
    return data;
  }
}
