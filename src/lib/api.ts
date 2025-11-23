// src/lib/api.ts
export async function fetchTokens(): Promise<any[]> {
  // replace with real API call; here we simulate latency
  await new Promise((r) => setTimeout(r, 700));
  return [
    { id: "1", symbol: "AXM", name: "Axiom Token", price: 0.42, change24h: 2.3, category: "new" },
    { id: "2", symbol: "TRD", name: "Trade Coin", price: 1.5, change24h: -1.2, category: "final" },
    { id: "3", symbol: "MIG", name: "Migrated Token", price: 0.03, change24h: 10.1, category: "migrated" },
  ];
}
