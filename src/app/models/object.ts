export function hasFunction(obj: object | null, fnName: string): boolean {
  while ((obj = Reflect.getPrototypeOf(obj as object)) !== null) {
    if (Reflect.ownKeys(obj).find((key) => key === fnName)) {
      return true;
    }
  }
  return false;
}
