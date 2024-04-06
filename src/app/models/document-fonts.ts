import {FIGSerializeProperty} from "../parsers/document.parser";
import {base64_to_buffer, buffer_to_base64} from "./string";

export interface FIGFont {
  name: string;
  size: number;
  buffer?: Uint8Array;
}

export function formatImGuiFontName(font: FIGFont): string {
  return `${font.name}, ${font.size.toFixed(0)}px`;
}

export const FIGFontDefaults: FIGFont[] = [
  {name: 'ProggyClean.ttf', size: 13},
  {name: 'Sweet16.ttf', size: 16},
  {name: 'Sweet16mono.ttf', size: 16},
];

export const FIGFontsSerializers: FIGSerializeProperty[] = [
  {name: 'name'},
  {name: 'size'},
  {
    name: 'buffer',
    optional: true,
    default: undefined,
    read: (data: string) => base64_to_buffer(data),
    write: (buffer: Uint8Array) => buffer_to_base64(buffer),
  },
];
