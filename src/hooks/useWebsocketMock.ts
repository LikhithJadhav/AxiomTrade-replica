// src/hooks/useWebsocketMock.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTokenPricesBatch } from "../store/slices/tokensSlice";
import { useSocketClient } from "./useSocketClient";
import type { RootState } from "../store";

export function useWebsocketMock(enabled = true) {
  const dispatch = useDispatch();
  const tokens = useSelector((s: RootState) => s.tokens.items);
  const client = useSocketClient("wss://local.mock");

  useEffect(() => {
    if (!enabled) return;
    const unsub = client.onUpdates((updates) => {
      dispatch(updateTokenPricesBatch(updates));
    });

    // simulation when no real server
    const sim = setInterval(() => {
      if (!tokens?.length) return;
      const updates = [];
      const n = 1 + Math.floor(Math.random() * Math.min(3, tokens.length));
      for (let i = 0; i < n; i++) {
        const t = tokens[Math.floor(Math.random() * tokens.length)];
        const dir = Math.random() > 0.5 ? 1 : -1;
        const pct = Math.random() * 0.03;
        updates.push({ id: t.id, price: Number((t.price * (1 + dir * pct)).toFixed(6)) });
      }
      client.simulateUpdate(updates);
    }, 800);

    return () => {
      unsub();
      clearInterval(sim);
    };
  }, [client, dispatch, enabled, tokens]);
}
