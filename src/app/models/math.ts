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
