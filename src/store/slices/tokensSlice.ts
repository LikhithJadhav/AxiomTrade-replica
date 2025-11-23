// src/store/slices/tokensSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TokenInfoBadge = { label: string; value: string; color?: "green" | "red" | "gray" };
export type Token = {
  id: string;
  symbol: string;
  name: string;
  logo?: string;
  timeAgo?: string;
  marketCap: number;
  marketCapChangePct: number;
  liquidity: number;
  volume24h: number;
  txnsTotal: number;
  txnsGreen: number;
  txnsRed: number;
  price: number;
  change24h: number;
  category: "new" | "final" | "migrated";
  badges: TokenInfoBadge[]; // e.g., risk, audits, paid/unpaid
};

type TokensState = {
  items: Token[];
  status: "idle" | "loading" | "error";
  error?: string | null;
};

const initialState: TokensState = {
  items: [
    {
      id: "1",
      symbol: "CANCEL",
      name: "CancelCards",
      logo: undefined,
      timeAgo: "20m",
      circulatingSupply: 267000,
      marketCap: 29200,
      marketCapChangePct: -14.8,
      liquidity: 22090,
      volume24h: 12800,
      txnsTotal: 266,
      txnsGreen: 151,
      txnsRed: 115,
      price: 0.41114,
      change24h: 2.3,
      category: "new",
      badges: [
        { label: "BotRisk", value: "26.05%", color: "red" },
        { label: "RugCheck", value: "7.81%", color: "red" },
        { label: "Paid", value: "Paid", color: "green" },
      ],
    },
    {
      id: "2",
      symbol: "MUTT",
      name: "MUTT",
      timeAgo: "4h",
      marketCap: 422000,
      marketCapChangePct: 14.95,
      liquidity: 63500,
      volume24h: 13700,
      txnsTotal: 147,
      txnsGreen: 79,
      txnsRed: 68,
      price: 1.49,
      change24h: 14.95,
      category: "final",
      badges: [
        { label: "BotRisk", value: "29.12%", color: "red" },
        { label: "Audits", value: "2.29%", color: "green" },
        { label: "Paid", value: "Paid", color: "green" },
      ],
    },
    {
      id: "3",
      symbol: "WIF02",
      name: "WIF02",
      timeAgo: "1h",
      marketCap: 19900,
      marketCapChangePct: 62.82,
      liquidity: 19000,
      volume24h: 2810,
      txnsTotal: 37,
      txnsGreen: 32,
      txnsRed: 5,
      price: 0.0297,
      change24h: 62.82,
      category: "migrated",
      badges: [
        { label: "Risk", value: "26.7%", color: "red" },
        { label: "Liquidity", value: "0%", color: "green" },
        { label: "Paid", value: "Unpaid", color: "red" },
      ],
    },
    {
      id: "34",
      symbol: "STARE",
      name: "Trump's Stare",
      timeAgo: "56m",
      marketCap: 11500,
      marketCapChangePct: 98.03,
      liquidity: 19400,
      volume24h: 4590,
      txnsTotal: 91,
      txnsGreen: 38,
      txnsRed: 53,
      price: 3.0487,
      change24h: 98.03,
      category: "migrated",
      badges: [
        { label: "Risk", value: "26.7%", color: "red" },
        { label: "Liquidity", value: "0%", color: "green" },
        { label: "Paid", value: "Paid", color: "green" },
      ],
    },
  ],
  status: "idle",
  error: null,
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Token[]>) {
      state.items = action.payload;
    },
    updateTokenPricesBatch(state, action: PayloadAction<{ id: string; price: number }[]>) {
    for (const u of action.payload) {
        const t = state.items.find((x) => x.id === u.id);
        if (t) {
        // update price
        t.price = u.price;
        // recompute market cap if we have a supply field
        if ((t as any).circulatingSupply != null) {
            t.marketCap = Number(((t as any).circulatingSupply * u.price).toFixed(2));
        }
        // optionally update change24h if you compute it from historical data
        }
    }
    },

    setLoading(state) {
      state.status = "loading";
    },
    setError(state, action: PayloadAction<string | null>) {
      state.status = action.payload ? "error" : "idle";
      state.error = action.payload;
    },
  },
});

export const { setTokens, updateTokenPricesBatch, setLoading, setError } = tokensSlice.actions;
export default tokensSlice.reducer;
