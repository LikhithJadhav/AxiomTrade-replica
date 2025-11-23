// src/components/TokenTable/TokenTable.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TokenRow from "./TokenRow";
import { useWebsocketMock } from "../../hooks/useWebsocketMock";
import type { RootState } from "../../store";
import { formatCurrencyShort } from "../../utils/format";
import clsx from "clsx";

type SortKey = "marketCap" | "liquidity" | "volume24h" | "txns" | "price" | "symbol";

export default function TokenTable() {
  useWebsocketMock(true);
  const tokens = useSelector((s: RootState) => s.tokens.items);
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...tokens];
    arr.sort((a, b) => {
      let v = 0;
      if (sortKey === "marketCap") v = a.marketCap - b.marketCap;
      else if (sortKey === "liquidity") v = a.liquidity - b.liquidity;
      else if (sortKey === "volume24h") v = a.volume24h - b.volume24h;
      else if (sortKey === "txns") v = a.txnsTotal - b.txnsTotal;
      else if (sortKey === "price") v = a.price - b.price;
      else v = a.symbol.localeCompare(b.symbol);
      return sortDesc ? -v : v;
    });
    return arr;
  }, [tokens, sortKey, sortDesc]);

  const headerCell = (label: string, key: SortKey | null, width?: string) => (
    <th className={clsx("py-3 px-4 text-left text-sm text-neutral-400", width)} onClick={() => { if (key) { setSortKey(key); setSortDesc(k => (k === key ? !k : true)); } }}>
      <div className="flex items-center gap-2">
        <span>{label}</span>
      </div>
    </th>
  );

  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium">Trending</h2>
        <div className="text-sm text-neutral-400">1m • 5m • 30m • 1h</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {headerCell("Pair Info", null, "min-w-[220px]")}
              {headerCell("Market Cap", "marketCap", "text-right min-w-[110px]")}
              {headerCell("Liquidity", "liquidity", "text-right min-w-[110px]")}
              {headerCell("Volume", "volume24h", "text-right min-w-[110px]")}
              {headerCell("TXNS", "txns", "text-right min-w-[110px]")}
              <th className="py-3 px-4 text-left min-w-[160px] text-sm text-neutral-400">Token Info</th>
              {headerCell("Price", "price", "text-right min-w-[140px]")}
              <th className="py-3 px-4 text-right min-w-[120px]"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <TokenRow key={t.id} token={t} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-neutral-400">Showing {tokens.length} tokens</div>
    </div>
  );
}
