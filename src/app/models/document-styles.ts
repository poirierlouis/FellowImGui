import {FIGSerializeProperty} from "../parsers/document.parser";

export type FIGThemeColors = 'dark' | 'light' | 'classic';

export interface FIGStyles {
  theme: FIGThemeColors;
}

export const FIGStylesSerializers: FIGSerializeProperty[] = [
  {name: 'theme'}
];
