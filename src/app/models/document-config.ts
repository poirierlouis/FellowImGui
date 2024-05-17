import {FIGSerializeProperty} from "../parsers/document.parser";
import {FIGFont, FIGFontsSerializers} from "./document-fonts";
import {FIGSizes, FIGSizesSerializers} from "./document-sizes";
import {FIGColors, FIGColorsSerializers} from "./document-colors";

export type FIGThemeColors = 'dark' | 'light' | 'classic';

export interface FIGConfig {
  font?: string; // ImGuiFontName format (e.g. "File.ttf, 42px")
  embeddedFonts: FIGFont[];
  sizes?: FIGSizes;
  theme: FIGThemeColors;
  colors?: FIGColors;
}

export const FIGConfigSerializers: FIGSerializeProperty[] = [
  {name: 'font', optional: true, default: undefined},
  {name: 'embeddedFonts', type: 'array', innerType: FIGFontsSerializers},
  {name: 'sizes', optional: true, default: undefined, type: 'object', innerType: FIGSizesSerializers},
  {name: 'theme'},
  {name: 'colors', optional: true, default: undefined, type: 'object', innerType: FIGColorsSerializers},
];
