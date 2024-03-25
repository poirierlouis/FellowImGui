export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function stringifyRGBA(value: Color): string {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
}

export function stringifyHEX(value: Color): string {
  const r: string = Math.floor(value.r * 255).toString(16);
  const g: string = Math.floor(value.g * 255).toString(16);
  const b: string = Math.floor(value.b * 255).toString(16);
  const a: string = Math.floor(value.a * 255).toString(16);

  return `#${r}${g}${b}${a}`;
}

export function parseRGBA(value: string): Color | undefined {
  const rule = new RegExp(/rgba?\((?<r>[0-9]{1,3}), (?<g>[0-9]{1,3}), (?<b>[0-9]{1,3})(, (?<a>-?([0-9]*[.])?[0-9]+))?\)/);
  const match = value.match(rule);

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

export function plotSin(size: number): number[] {
  const data: number[] = [];

  for (let i: number = 0; i < size; i++) {
    data.push(Math.sin(i * 0.2));
  }
  return data;
}
