import {FIGSerializeProperty} from "../document.parser";
import {FIGJsonKeygen} from "./keygen.json";

export class FIGJsonReader {

  public static readObject(json: any, serializers: FIGSerializeProperty[], version: number): any | undefined {
    if (json === undefined) {
      return undefined;
    }
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const object: any = {};

    serializers = serializers.filter((serializer) => (serializer.version ?? 0) <= version);
    for (const serializer of serializers) {
      const key: string = keygen.next();
      const value: any | undefined = this.readProperty(key, json, serializer);

      if (value !== undefined) {
        object[serializer.name] = serializer.read?.(value) ?? value;
      }
    }
    return object;
  }

  public static readProperty(key: string, json: any, serializer: FIGSerializeProperty): any {
    if (!(key in json)) {
      return undefined;
    }
    if (serializer.type === 'object' && serializer.innerType) {
      const keygen: FIGJsonKeygen = new FIGJsonKeygen();
      const innerJson: any = json[key];
      const innerValue: any = {};

      for (const innerSerializer of serializer.innerType) {
        const innerKey: string = keygen.next();
        const innerProperty: any | undefined = this.readProperty(innerKey, innerJson, innerSerializer);

        if (innerProperty !== undefined) {
          innerValue[innerSerializer.name] = innerSerializer.read?.(innerProperty) ?? innerProperty;
        }
      }
      return serializer.read?.(innerValue) ?? innerValue;
    }
    if (serializer.type === 'array' && serializer.innerType) {
      const innerJson: any = json[key];
      const innerValue: any = [];

      for (const itemJson of innerJson) {
        const keygen: FIGJsonKeygen = new FIGJsonKeygen();
        const innerItem: any = {};

        for (const innerSerializer of serializer.innerType) {
          const innerKey: string = keygen.next();
          const innerProperty: any | undefined = this.readProperty(innerKey, itemJson, innerSerializer);

          if (innerProperty !== undefined) {
            innerItem[innerSerializer.name] = innerProperty;
          }
        }
        innerValue.push(innerItem);
      }
      return serializer.read?.(innerValue) ?? innerValue;
    }
    const value: any = json[key];

    return serializer.read?.(value) ?? value;
  }

}
