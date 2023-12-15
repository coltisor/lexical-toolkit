export function cs(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
