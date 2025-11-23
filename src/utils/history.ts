// src/utils/history.ts
// Deterministic pseudo-random history generator — same output on server & client.
// seedSource can be token.price or token.id (string) combined to produce deterministic sequence.

function hashStringToNumber(s: string) {
  // simple string hash -> number
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function generateHistory(seedSource: string | number, n = 20) {
  const base = typeof seedSource === "number" ? seedSource : hashStringToNumber(String(seedSource));
  const arr: number[] = [];
  // deterministic "random" step generator using sine; stable for same base
  let v = typeof seedSource === "number" ? seedSource : (base % 100) / 10 + 1;
  for (let i = 0; i < n; i++) {
    // compute pseudo-random change in [-0.03, +0.03] deterministic
    const t = base + i * 31;
    const change = (Math.sin(t * 0.013) + Math.cos(t * 0.007)) * 0.015;
    v = Math.max(0, v * (1 + change));
    arr.push(Number(v.toFixed(6)));
  }
  return arr;
}
