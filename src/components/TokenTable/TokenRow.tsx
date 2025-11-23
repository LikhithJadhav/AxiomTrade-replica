// src/components/TokenTable/TokenRow.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Token } from "../../store/slices/tokensSlice";
import { formatCurrencyShort } from "../../utils/format";
import clsx from "clsx";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import Sparkline from "../ui/Sparkline";
import { generateHistory } from "../../utils/history";

/**
 * TokenRow - row for a token in the table
 *
 * Notes:
 * - All hooks (useState/useEffect) are inside the component function (required).
 * - generateHistory(token.id, ...) is deterministic (same on server & client).
 * - handleConfirmBuy simulates a buy (delay) and closes the modal.
 */
export default function TokenRow({ token }: { token: Token }) {
  // Hooks MUST be inside the component body
  const prev = useRef(token.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [openBuy, setOpenBuy] = useState(false);
  const [buying, setBuying] = useState(false);
  const amountRef = useRef<HTMLInputElement | null>(null);

    // inside TokenRow component (after hooks definitions)
    const initialHistory = React.useMemo(() => generateHistory(token.id, 20), [token.id]);
    // store history locally so we can append every time price changes
    const [history, setHistory] = useState<number[]>(initialHistory);

    // whenever token.price changes (from Redux updates), append it to history
    useEffect(() => {
    // append latest price and keep last 20 points
    setHistory((h) => {
        // if last item equals price, don't append (avoid duplicate)
        if (h.length && Math.abs(h[h.length - 1] - token.price) < 1e-12) return h;
        const next = [...h.slice(-19), token.price];
        return next;
    });
    }, [token.price]);


  useEffect(() => {
    if (prev.current === token.price) return;
    setFlash(token.price > prev.current ? "up" : "down");
    const id = setTimeout(() => setFlash(null), 600);
    prev.current = token.price;
    return () => clearTimeout(id);
  }, [token.price]);

  function handleConfirmBuy() {
    const amount = Number(amountRef.current?.value ?? 0) || 0;
    setBuying(true);
    // Simulate network latency
    setTimeout(() => {
      setBuying(false);
      setOpenBuy(false);
      console.log(`Simulated buy: ${amount} USD of ${token.symbol}`);
      // Optionally show a simple in-page confirmation (replace with toast lib)
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Bought ${token.symbol}`, { body: `Order: $${amount}` });
        }
      } catch (e) {
        // ignore
      }
    }, 700);
  }

  return (
    <>
      <tr className="border-t border-neutral-700 hover:bg-neutral-800 transition-colors">
        {/* Pair Info */}
        <td className="py-4 pr-6 min-w-[220px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-neutral-700 flex items-center justify-center overflow-hidden">
              {token.logo ? (
                <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm">{token.symbol[0]}</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium truncate">{token.name}</div>
                <div className="text-xs text-neutral-400"> {token.symbol}</div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                <div className="px-2 py-0.5 rounded bg-neutral-800">{token.timeAgo ?? "—"}</div>
                <div className="flex items-center gap-2">
                  <button className="text-neutral-400 text-xs" aria-label="website">🌐</button>
                  <button className="text-neutral-400 text-xs" aria-label="explorer">🔗</button>
                  <button className="text-neutral-400 text-xs" aria-label="search">🔍</button>
                </div>
              </div>
            </div>
          </div>
        </td>

        {/* Sparkline column (left of Market Cap) */}
        <td className="py-4 pr-6 hidden sm:table-cell w-[120px]">
          <div className="flex items-center justify-center">
            <div className="w-28 sm:w-36">
              <Sparkline
                data={history}
                width={120}
                height={32}
                stroke={token.change24h >= 0 ? "#18b07a" : "#ff5c7c"}
                fill={token.change24h >= 0 ? "rgba(24,176,122,0.06)" : "rgba(255,92,124,0.04)"}
              />
            </div>
          </div>
        </td>

        {/* Market Cap */}
        <td className="py-4 pr-6 text-right w-[120px]">
          <div className="font-medium">{formatCurrencyShort(token.marketCap)}</div>
          <div className={clsx("text-xs mt-1", token.marketCapChangePct >= 0 ? "text-green-400" : "text-red-400")}>
            {token.marketCapChangePct >= 0 ? "+" : ""}{token.marketCapChangePct}%
          </div>
        </td>

        {/* Liquidity */}
        <td className="py-4 pr-6 text-right hidden md:table-cell w-[120px]">
          <div className="font-medium">{formatCurrencyShort(token.liquidity)}</div>
        </td>

        {/* Volume */}
        <td className="py-4 pr-6 text-right hidden md:table-cell w-[120px]">
          <div className="font-medium">{formatCurrencyShort(token.volume24h)}</div>
        </td>

        {/* TXNS */}
        <td className="py-4 pr-6 text-right hidden lg:table-cell w-[110px]">
          <div className="font-medium">{token.txnsTotal}</div>
          <div className="text-xs mt-1">
            <span className="text-green-400">{token.txnsGreen}</span>
            <span className="text-neutral-400"> / </span>
            <span className="text-red-400">{token.txnsRed}</span>
          </div>
        </td>

        {/* Token Info */}
        <td className="py-4 pr-6 hidden lg:table-cell min-w-[160px]">
          <div className="flex gap-2 flex-wrap">
            {token.badges.map((b, i) => (
              <div key={i} className={clsx("text-xs px-2 py-1 rounded inline-flex items-center gap-2", b.color === "green" ? "bg-neutral-800 text-green-300" : b.color === "red" ? "bg-neutral-800 text-red-300" : "bg-neutral-800 text-neutral-200")}>
                <span className="font-medium">{b.value}</span>
                <span className="text-neutral-500">{b.label}</span>
              </div>
            ))}
          </div>
        </td>

        {/* Price & 24h */}
        <td className="py-4 pr-6 text-right w-[130px]">
          <motion.div key={token.price} initial={{ opacity: 0.85 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className={clsx("font-semibold", flash === "up" ? "text-green-300" : flash === "down" ? "text-red-300" : "text-white")}>
            ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(4)}
          </motion.div>
          <div className={clsx("text-xs mt-1", token.change24h >= 0 ? "text-green-400" : "text-red-400")}>
            {token.change24h >= 0 ? "+" : ""}{token.change24h}%
          </div>
        </td>

        {/* Action */}
        <td className="py-4 pr-2 text-right min-w-[120px]">
          <div className="flex items-center justify-end gap-3">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-sm" aria-label="more actions">•••</button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-neutral-800 p-3 rounded shadow-md w-48" sideOffset={6}>
                  <div className="flex flex-col gap-2">
                    <button className="text-left text-sm" onClick={() => setOpenBuy(true)}>Buy</button>
                    <button className="text-left text-sm" onClick={() => navigator.clipboard?.writeText(token.symbol)}>Copy</button>
                    <button className="text-left text-sm text-red-400">Report</button>
                  </div>
                  <Popover.Arrow className="fill-neutral-800" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <button onClick={() => setOpenBuy(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              Buy
            </button>
          </div>
        </td>
      </tr>

      {/* Buy modal */}
<Dialog.Root open={openBuy} onOpenChange={setOpenBuy}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/60" />
    <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 bg-neutral-900 rounded p-5 shadow-lg">
      {/* Accessible title for screen readers */}
      <Dialog.Title className="sr-only">Buy {token.symbol}</Dialog.Title>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{token.name} — {token.symbol}</h3>
          <div className="text-sm text-neutral-400">Price: ${token.price}</div>
        </div>
        <Dialog.Close asChild>
          <button className="text-neutral-400" aria-label="Close dialog">✕</button>
        </Dialog.Close>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-neutral-300">Amount (USD)</label>
        <input ref={amountRef} type="number" className="mt-2 w-full bg-neutral-800 px-3 py-2 rounded border border-neutral-700" placeholder="100" defaultValue="100" />
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button className="px-4 py-2 rounded bg-neutral-700" onClick={() => setOpenBuy(false)}>Cancel</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleConfirmBuy} disabled={buying}>
          {buying ? "Buying…" : "Confirm Buy"}
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

    </>
  );
}
