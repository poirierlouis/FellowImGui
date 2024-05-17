import {FIGConfig} from "../models/document-config";
import {FIGEntity} from "./entity";
import {FIGSerializeProperty} from "../parsers/document.parser";
import {FIGFontsSerializers} from "../models/document-fonts";
import {FIGSizesSerializers} from "../models/document-sizes";
import {FIGColorsSerializers} from "../models/document-colors";

export interface FIGTemplateEntity extends FIGConfig, FIGEntity {
  title: string;
}

export const FIGTemplateSerializers: FIGSerializeProperty[] = [
  {name: 'title'},
  {name: 'font', optional: true, default: undefined},
  {name: 'embeddedFonts', type: 'array', innerType: FIGFontsSerializers},
  {name: 'sizes', optional: true, default: undefined, type: 'object', innerType: FIGSizesSerializers},
  {name: 'theme'},
  {name: 'colors', optional: true, default: undefined, type: 'object', innerType: FIGColorsSerializers},
];
