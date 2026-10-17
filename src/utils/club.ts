export const clubLabel = (name?: string | null) => name?.trim() || "クラブ未設定";

const clubCollator = new Intl.Collator("ja", { numeric: true });

export function compareClubNames(a?: string | null, b?: string | null) {
  const first = a?.trim() || "";
  const second = b?.trim() || "";
  if (!first) return second ? 1 : 0;
  if (!second) return -1;
  return clubCollator.compare(first, second);
}
