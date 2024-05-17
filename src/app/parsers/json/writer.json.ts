import {FIGSerializeProperty} from "../document.parser";
import {FIGJsonKeygen} from "./keygen.json";

export class FIGJsonWriter {

  public static writeObject(object: any, serializers: FIGSerializeProperty[]): any {
    const keygen: FIGJsonKeygen = new FIGJsonKeygen();
    const json: any = {};

    for (const serializer of serializers) {
      const value: any | undefined = this.writeProperty(object, serializer);
      const key: string = keygen.next();

      if (value !== undefined) {
        json[key] = serializer.write?.(value) ?? value;
      }
    }
    return json;
  }

  public static writeProperty(object: any, serializer: FIGSerializeProperty): any {
    const value: any = object[serializer.name];

    if (serializer.optional && value === serializer.default) {
      if (serializer.type === 'array' && value.length === serializer.default.length) {
        return undefined;
      } else if (value === serializer.default) {
        return undefined;
      }
    }
    if (serializer.type === 'object' && serializer.innerType) {
      const keygen: FIGJsonKeygen = new FIGJsonKeygen();
      const innerValue: any = {};

      for (const innerSerializer of serializer.innerType) {
        const innerProperty: any | undefined = this.writeProperty(value, innerSerializer);
        const key: string = keygen.next();

        if (innerProperty !== undefined) {
          innerValue[key] = innerSerializer.write?.(innerProperty) ?? innerProperty;
        }
      }
      return serializer.write?.(innerValue) ?? innerValue;
    }
    if (serializer.type === 'array' && serializer.innerType) {
      const innerValue: any = [];

      for (const item of value) {
        const keygen: FIGJsonKeygen = new FIGJsonKeygen();
        const innerItem: any = {};

        for (const innerSerializer of serializer.innerType) {
          const innerProperty: any | undefined = this.writeProperty(item, innerSerializer);
          const key: string = keygen.next();

          if (innerProperty !== undefined) {
            innerItem[key] = innerProperty;
          }
        }
        innerValue.push(innerItem);
      }
      return serializer.write?.(innerValue) ?? innerValue;
    }
    return serializer.write?.(value) ?? value;
  }

}
