// src/utils/currency.ts
export function formatCurrency(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  if (v >= 0.01) return v.toFixed(4);
  return v.toPrecision(3);
}
