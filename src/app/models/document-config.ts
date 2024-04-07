import {FIGSerializeProperty} from "../parsers/document.parser";
import {FIGFont, FIGFontsSerializers} from "./document-fonts";

export type FIGThemeColors = 'dark' | 'light' | 'classic';

export interface FIGConfig {
  theme: FIGThemeColors;
  font?: string; // ImGuiFontName format (e.g. "File.ttf, 42px")
  embeddedFonts: FIGFont[];
}

export const FIGConfigSerializers: FIGSerializeProperty[] = [
  {name: 'theme'},
  {name: 'font', optional: true, default: undefined},
  {name: 'embeddedFonts', type: 'array', innerType: FIGFontsSerializers}
];
