export function getEnumValues<T>(data: object): T[] {
  return Object.keys(data)
    .filter((value: string) => !Number.isNaN(Number(value)))
    .map((value: string) => +value as T);
}
