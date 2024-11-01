const formatRule: RegExp = new RegExp(/^%\.(?<precision>[0-9]+)f$/);

export function getPrecision(format: string): number | undefined {
  const match: RegExpMatchArray | null = format.match(formatRule);

  return match ? +match.groups!['precision'] : undefined;
}

export function formatNumber(value: number, format: string): string {
  const precision: number | undefined = getPrecision(format);

  if (!precision) {
    return value.toString();
  }
  return value.toFixed(precision);
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase() + str.slice(1)}`;
}

export function deCapitalize(str: string): string {
  return `${str.charAt(0).toLowerCase() + str.slice(1)}`;
}

export function sanitizeVar(str: string): string {
  return str.replaceAll(/[^a-zA-Z0-9 ]/g, '');
}

export function toSnakeCase(str: string): string {
  const words: string[] = str.toLowerCase().split(/[ \t]+/);

  return words.join('_');
}

export function toCamelCase(str: string): string {
  const words: string[] = str.split(/[ \t]+/);

  return words.map((word, i) => (i > 0) ? capitalize(word) : deCapitalize(word)).join('');
}

export function buffer_to_base64(buffer: Uint8Array): string {
  const binary: string = Array.from(buffer, (byte) => String.fromCodePoint(byte)).join('');

  return btoa(binary);
}

export function base64_to_buffer(str: string): Uint8Array {
  const binary: string = atob(str);

  return Uint8Array.from(binary, (value: any) => value.codePointAt(0));
}
