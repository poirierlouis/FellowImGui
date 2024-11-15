import {FIGSerializeProperty} from "../parsers/document.parser";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export type Size = Record<'width' | 'height', number> & {
  width: number;
  height: number;
};

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const ColorSerializers: FIGSerializeProperty[] = [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a'}];

export function stringifyRGBA(value: Color): string {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
}

export function stringifyHEX(value: Color): string {
  let r: number | string = Math.floor(value.r * 255);
  let g: number | string = Math.floor(value.g * 255);
  let b: number | string = Math.floor(value.b * 255);
  let a: number | string = Math.floor(value.a * 255);

  r = (r <= 15) ? `0${r.toString(16)}` : `${r.toString(16)}`;
  g = (g <= 15) ? `0${g.toString(16)}` : `${g.toString(16)}`;
  b = (b <= 15) ? `0${b.toString(16)}` : `${b.toString(16)}`;
  a = (a <= 15) ? `0${a.toString(16)}` : `${a.toString(16)}`;
  return `#${r}${g}${b}${a}`;
}

const rgbaRule: RegExp = new RegExp(/rgba?\((?<r>[0-9]{1,3}), (?<g>[0-9]{1,3}), (?<b>[0-9]{1,3})(, (?<a>-?([0-9]*[.])?[0-9]+))?\)/);

export function parseRGBA(value: string): Color | undefined {
  const match: RegExpMatchArray | null = value.match(rgbaRule);

  if (!match) {
    return undefined;
  }
  return {
    r: parseFloat(match.groups!['r']) / 255.0,
    g: parseFloat(match.groups!['g']) / 255.0,
    b: parseFloat(match.groups!['b']) / 255.0,
    a: parseFloat(match.groups!['a'] ?? '1.0'),
  };
}

const hexRule: RegExp = new RegExp(/#(?<r>[0-9A-Fa-f]{2})(?<g>[0-9A-Fa-f]{2})(?<b>[0-9A-Fa-f]{2})(?<a>[0-9A-Fa-f]{2})?/);

export function parseHEX(value: string): Color | undefined {
  const match: RegExpMatchArray | null = value.match(hexRule);

  if (!match) {
    return undefined;
  }
  return {
    r: parseInt(match.groups!['r'], 16) / 255.0,
    g: parseInt(match.groups!['g'], 16) / 255.0,
    b: parseInt(match.groups!['b'], 16) / 255.0,
    a: parseInt(match.groups!['a'], 16) / 255.0,
  };
}

export function plotSin(size: number): number[] {
  const data: number[] = [];

  for (let i: number = 0; i < size; i++) {
    data.push(Math.sin(i * 0.2));
  }
  return data;
}

export function isFloat(value: number | null): boolean {
  return (value === null) ? false : value % 1 !== 0;
}
