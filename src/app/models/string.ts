export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase() + str.slice(1)}`;
}

export function deCapitalize(str: string): string {
  return `${str.charAt(0).toLowerCase() + str.slice(1)}`;
}

export function sanitizeVar(str: string): string {
  return str.replaceAll(/[^a-zA-Z ]/g, '');
}

export function toSnakeCase(str: string): string {
  const words: string[] = str.toLowerCase().split(/[ \t]+/);

  return words.join('_');
}

export function toCamelCase(str: string): string {
  const words: string[] = str.split(/[ \t]+/);

  return words.map((word, i) => (i > 0) ? capitalize(word) : deCapitalize(word)).join('');
}
