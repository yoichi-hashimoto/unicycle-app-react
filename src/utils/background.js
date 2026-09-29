export function getBackgroundStyle(value) {
  if (!value) return {};

  return value.includes("gradient(")
    ? { background: value }
    : { backgroundColor: value };
}
