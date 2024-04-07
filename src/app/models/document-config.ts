import {FIGSerializeProperty} from "../parsers/document.parser";
import {FIGFont, FIGFontsSerializers} from "./document-fonts";
import {FIGSizes, FIGSizesSerializers} from "./document-sizes";

export type FIGThemeColors = 'dark' | 'light' | 'classic';

export interface FIGConfig {
  font?: string; // ImGuiFontName format (e.g. "File.ttf, 42px")
  embeddedFonts: FIGFont[];
  theme: FIGThemeColors;
  sizes?: FIGSizes;
}

export const FIGConfigSerializers: FIGSerializeProperty[] = [
  {name: 'font', optional: true, default: undefined},
  {name: 'embeddedFonts', type: 'array', innerType: FIGFontsSerializers},
  {name: 'theme'},
  {name: 'sizes', optional: true, default: undefined, innerType: FIGSizesSerializers},
];
