export function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  return Math.max(0, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
}

export function fmtDate(d) {
  if (!d) return "";
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
