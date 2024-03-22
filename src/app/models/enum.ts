export function getEnumValues<T>(data: any): T[] {
  return Object.keys(data)
    .filter((value: string) => !isNaN(Number(value)))
    .map((value: string) => +value as T);
}
