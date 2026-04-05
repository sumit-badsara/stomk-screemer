"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  BarChart3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { mockData, type Stock } from "@/data/mock";

// --- Types ---

type DisplayStock = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  signal: "bullish" | "bearish" | "neutral";
  score: number;
  tagline: string;
  goodSignals?: string[];
  badSignals?: string[];
  consensus?: string; // STRONG BUY / BUY / HOLD / SELL / STRONG SELL
};

// --- Components ---

function normalizeSignal(signal: string, consensus?: string): { label: string; bg: string; Icon: typeof TrendingUp } {
  const raw = (consensus || signal || "").toUpperCase();
  if (raw.includes("BUY") || raw.includes("BULLISH")) return { label: "Buy", bg: "bg-green", Icon: TrendingUp };
  if (raw.includes("SELL") || raw.includes("BEARISH")) return { label: "Sell", bg: "bg-red", Icon: TrendingDown };
  return { label: "Hold", bg: "bg-cream", Icon: Minus };
}

function SignalBadge({ signal, consensus }: { signal: string; consensus?: string }) {
  const s = normalizeSignal(signal, consensus);
  return (
    <span className={`${s.bg} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border-[3px] border-fg`}>
      <s.Icon size={12} strokeWidth={3} />
      {s.label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 7 ? "bg-green" : score >= 5 ? "bg-yellow-light" : "bg-red";
  return (
    <span className={`${bg} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border-[3px] border-fg tabular-nums`}>
      {score}/10
    </span>
  );
}

function getCardColor(stock: DisplayStock): string {
  return normalizeSignal(stock.signal, stock.consensus).bg;
}

function StockCard({ stock, rank }: { stock: DisplayStock; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const bgColor = getCardColor(stock);
  const changeColor = stock.changePct >= 0 ? "text-green-dark" : "text-red-dark";
  const hasSignals = (stock.goodSignals?.length ?? 0) > 0 || (stock.badSignals?.length ?? 0) > 0;

  return (
    <div className={`card ${bgColor}`}>
      <Link href={`/stock/${stock.ticker}`} className="block p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg font-bold text-fg/60 w-7 shrink-0">{rank}.</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg">{stock.name}</span>
                <SignalBadge signal={stock.signal} consensus={stock.consensus} />
                <ScoreBadge score={stock.score} />
              </div>
              <span className="text-sm text-fg/70 font-bold">
                {stock.ticker} &middot; {stock.sector || "—"}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-lg tabular-nums">
              ₹{stock.price.toLocaleString("en-IN")}
            </div>
            <div className={`text-sm font-bold tabular-nums ${changeColor}`}>
              {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-fg/60 font-semibold line-clamp-1">{stock.tagline}</span>
          <ArrowRight size={16} strokeWidth={3} className="shrink-0" />
        </div>
      </Link>

      {hasSignals && (
        <div className="px-4 sm:px-5 pb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-fg/50 flex items-center gap-1 hover:text-fg transition-colors"
          >
            {expanded ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
            {expanded ? "Hide" : "Show"} signals
          </button>
          {expanded && (
            <div className="mt-2 pt-2 border-t-2 border-fg/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stock.goodSignals && stock.goodSignals.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Good Signals</span>
                  {stock.goodSignals.map((s, i) => (
                    <span key={i} className="text-xs font-semibold flex items-start gap-1.5">
                      <CheckCircle size={10} strokeWidth={3} className="text-green-dark shrink-0 mt-0.5" />
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {stock.badSignals && stock.badSignals.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-red-dark uppercase tracking-wider">Bad Signals</span>
                  {stock.badSignals.map((s, i) => (
                    <span key={i} className="text-xs font-semibold flex items-start gap-1.5">
                      <XCircle size={10} strokeWidth={3} className="text-red-dark shrink-0 mt-0.5" />
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Converters ---

function mockToDisplay(stock: Stock): DisplayStock {
  return {
    ticker: stock.ticker, name: stock.name, sector: stock.sector,
    price: stock.price, changePct: stock.changePct, signal: stock.signal,
    score: stock.score, tagline: stock.tagline,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sheetToDisplay(row: Record<string, any>): DisplayStock {
  const rawSignal = String(row.signal ?? "neutral").toLowerCase();
  const signal = (["bullish", "bearish", "neutral"].includes(rawSignal) ? rawSignal : "neutral") as DisplayStock["signal"];
  return {
    ticker: row.ticker ?? "", name: row.name ?? row.ticker ?? "",
    sector: row.sector ?? "", price: Number(row.price) || 0,
    changePct: Number(row.changePct) || 0, signal,
    score: Number(row.score) || 5,
    tagline: row.tagline ?? row.verdict ?? "",
    goodSignals: row.goodSignals ? String(row.goodSignals).split("|").map((s: string) => s.trim()).filter(Boolean) : undefined,
    badSignals: row.badSignals ? String(row.badSignals).split("|").map((s: string) => s.trim()).filter(Boolean) : undefined,
  };
}

// --- Page ---

export default function StocksPage() {
  const [activeTab, setActiveTab] = useState<"top10" | "all">("top10");
  const [sheetDaily, setSheetDaily] = useState<DisplayStock[] | null>(null);
  const [sheetAll, setSheetAll] = useState<DisplayStock[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [dataSource, setDataSource] = useState<"sheet" | "mock">("mock");

  useEffect(() => {
    Promise.all([
      fetch("/api/stocks?tab=Daily").then((r) => r.json()),
      fetch("/api/stocks?tab=All+Stocks").then((r) => r.json()),
      fetch("/api/stocks?tab=Analyst+Predictions").then((r) => r.json()),
    ])
      .then(([daily, all, predictions]) => {
        // Build consensus map from analyst predictions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const consensusMap: Record<string, string> = {};
        if (predictions.data?.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const p of predictions.data as any[]) {
            if (p.ticker && p.consensus) {
              consensusMap[String(p.ticker).toUpperCase()] = String(p.consensus);
            }
          }
        }

        function mergeConsensus(stocks: DisplayStock[]): DisplayStock[] {
          return stocks.map((s) => ({
            ...s,
            consensus: consensusMap[s.ticker.toUpperCase()] || undefined,
          }));
        }

        if (daily.data?.length > 0) {
          const stocks = mergeConsensus(daily.data.map(sheetToDisplay));
          stocks.sort((a: DisplayStock, b: DisplayStock) => b.score - a.score);
          setSheetDaily(stocks.slice(0, 10));
          setDataSource("sheet");
          const ts = daily.data[0]?.updatedAt;
          if (ts) {
            try { setLastUpdated(new Date(ts).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })); }
            catch { setLastUpdated(ts); }
          }
        }
        if (all.data?.length > 0) {
          const stocks = mergeConsensus(all.data.map(sheetToDisplay));
          stocks.sort((a: DisplayStock, b: DisplayStock) => b.score - a.score);
          setSheetAll(stocks);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: "top10" as const, label: "Top 10", Icon: Flame },
    { key: "all" as const, label: "All Stocks", Icon: BarChart3 },
  ];

  let stocks: DisplayStock[];
  if (activeTab === "top10") {
    stocks = sheetDaily ?? mockData.daily.map(mockToDisplay);
  } else {
    stocks = sheetAll ?? mockData.daily.map(mockToDisplay);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Top Stocks</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn px-5 py-2.5 text-sm inline-flex items-center gap-2 ${
              activeTab === tab.key ? "bg-yellow text-fg" : "bg-bg text-fg/70 hover:bg-lavender"
            }`}
          >
            <tab.Icon size={16} strokeWidth={3} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12">
          <Loader2 size={20} strokeWidth={3} className="animate-spin" />
          <span className="text-sm font-bold text-fg/50">Loading...</span>
        </div>
      )}

      {/* Stock list */}
      {!loading && (
        <div className="flex flex-col gap-4">
          {stocks.map((stock, i) => (
            <StockCard key={stock.ticker} stock={stock} rank={i + 1} />
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-8 text-center text-sm text-fg/60 font-bold">
        {dataSource === "sheet" ? (
          <>Last updated: {lastUpdated || "recently"} &middot; {stocks.length} stocks</>
        ) : (
          <>Mock data &middot; Run analysis to populate</>
        )}
      </div>
    </div>
  );
}
