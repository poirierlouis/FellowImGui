import type {FIGSerializeProperty} from "../parsers/document.parser";
import {type FIGColors, FIGColorsSerializers} from "./document-colors";
import {type FIGFont, FIGFontsSerializers} from "./document-fonts";
import {type FIGSizes, FIGSizesSerializers} from "./document-sizes";

export type FIGThemeColors = "dark" | "light" | "classic";

export interface FIGConfig {
  font?: string; // ImGuiFontName format (e.g. "File.ttf, 42px")
  embeddedFonts: FIGFont[];
  sizes?: FIGSizes;
  theme: FIGThemeColors;
  colors?: FIGColors;
}

export const FIGConfigSerializers: FIGSerializeProperty[] = [
  {name: "font", optional: true, default: undefined},
  {name: "embeddedFonts", type: "array", innerType: FIGFontsSerializers},
  {name: "sizes", optional: true, default: undefined, type: "object", innerType: FIGSizesSerializers},
  {name: "theme"},
  {name: "colors", optional: true, default: undefined, type: "object", innerType: FIGColorsSerializers},
];
