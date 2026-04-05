"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  CircleDot,
  Newspaper,
  Activity,
  BarChart3,
  Target,
  Clock,
  Loader2,
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getStockByTicker, type Stock as MockStock } from "@/data/mock";
import { notFound } from "next/navigation";
import StockChart from "@/components/StockChart";

// Types for API responses
type Fundamentals = {
  price: number;
  change: number;
  changePct: number;
  marketCap: string;
  pe: number | null;
  forwardPE: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyDayAvg: number;
  twoHundredDayAvg: number;
  debtToEquity: number | null;
  revenueGrowth: number | null;
  profitMargins: number | null;
  roe: number | null;
  promoterHolding: number | null;
  sector: string;
  industry: string;
  longName: string;
  volume: number;
  avgVolume: number;
};

type Technicals = {
  rsi: number | null;
  macd: "Bullish" | "Bearish" | "Neutral";
  sma50: number | null;
  sma200: number | null;
  bollingerUpper: number | null;
  bollingerMiddle: number | null;
  bollingerLower: number | null;
  dma50: "Above" | "Below";
  dma200: "Above" | "Below";
  volumeVsAvg: number | null;
};

type NewsArticle = {
  title: string;
  source: string;
  pubDate: string;
  link: string;
};

// --- Reusable UI ---

function TechRow({
  label,
  value,
  good,
}: {
  label: string;
  value: string | number;
  good: boolean | null;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b-2 border-fg/10 last:border-0">
      <span className="text-sm text-fg/70 font-semibold">{label}</span>
      <span className="text-sm font-bold flex items-center gap-1.5 tabular-nums">
        {value}
        {good === true && <Check size={14} strokeWidth={3} className="text-green-dark" />}
        {good === false && <X size={14} strokeWidth={3} className="text-red-dark" />}
        {good === null && <Minus size={14} strokeWidth={3} className="text-fg/40" />}
      </span>
    </div>
  );
}

function normalizeSignal(raw: string): { label: string; bg: string; Icon: typeof TrendingUp } {
  const s = raw.toUpperCase();
  if (s.includes("BUY") || s.includes("BULLISH")) return { label: "Buy", bg: "bg-green", Icon: TrendingUp };
  if (s.includes("SELL") || s.includes("BEARISH")) return { label: "Sell", bg: "bg-red", Icon: TrendingDown };
  return { label: "Hold", bg: "bg-cream", Icon: Minus };
}

function SignalBadge({ signal }: { signal: string }) {
  const s = normalizeSignal(signal);
  return (
    <span className={`${s.bg} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border-[3px] border-fg`}>
      <s.Icon size={14} strokeWidth={3} />
      {s.label}
    </span>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="panel p-5 bg-cream flex items-center justify-center gap-2 min-h-[140px]">
      <Loader2 size={16} strokeWidth={3} className="animate-spin" />
      <span className="text-sm font-bold text-fg/50">Loading {label}...</span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// --- Main Page ---

export default function StockDetail({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = use(params);

  // Mock data for hardcoded verdict/signals
  const mockStock = getStockByTicker(ticker);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SheetRow = Record<string, any>;
  type AnalystPrediction = {
    bull1mTarget: string; bear1mTarget: string; avg1mTarget: string;
    bull3mTarget: string; bear3mTarget: string; avg3mTarget: string;
    bullSignal: string; bearSignal: string;
    bullConviction: string; bearConviction: string;
    bullCatalysts: string; bearRisks: string;
    consensus: string;
  };

  const [resolvedSymbol, setResolvedSymbol] = useState<string | null>(null);
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null);
  const [technicals, setTechnicals] = useState<Technicals | null>(null);
  const [news, setNews] = useState<NewsArticle[] | null>(null);
  const [sheetStock, setSheetStock] = useState<SheetRow | null>(null);
  const [analystData, setAnalystData] = useState<AnalystPrediction | null>(null);
  const [loadingF, setLoadingF] = useState(true);
  const [loadingT, setLoadingT] = useState(true);
  const [loadingN, setLoadingN] = useState(true);

  // Step 1: Resolve the ticker + fetch sheet data
  useEffect(() => {
    fetch(`/api/resolve?ticker=${encodeURIComponent(ticker)}`)
      .then((r) => r.json())
      .then((d) => setResolvedSymbol(d.symbol))
      .catch(() => setResolvedSymbol(`${ticker}.NS`));

    // Fetch sheet data (verdict + signals from Claude analysis)
    fetch(`/api/stocks?tab=Daily`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const match = d.data.find((r: SheetRow) =>
            String(r.ticker).toUpperCase() === ticker.toUpperCase()
          );
          if (match) setSheetStock(match);
        }
      })
      .catch(() => {});

    // Fetch analyst predictions
    fetch(`/api/stocks?tab=Analyst Predictions`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const match = d.data.find((r: SheetRow) =>
            String(r.ticker).toUpperCase() === ticker.toUpperCase()
          );
          if (match) setAnalystData(match as AnalystPrediction);
        }
      })
      .catch(() => {});
  }, [ticker]);

  // Step 2: Once symbol is resolved, fetch all data
  useEffect(() => {
    if (!resolvedSymbol) return;

    // Fetch fundamentals
    fetch(`/api/fundamentals?symbol=${encodeURIComponent(resolvedSymbol)}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setFundamentals(d); })
      .catch(() => {})
      .finally(() => setLoadingF(false));

    // Fetch technicals from chart data (6mo daily for enough RSI/MACD history)
    fetch(`/api/chart?symbol=${encodeURIComponent(resolvedSymbol)}&range=6mo&interval=1d&technicals=1`)
      .then((r) => r.json())
      .then((d) => { if (d.technicals) setTechnicals(d.technicals); })
      .catch(() => {})
      .finally(() => setLoadingT(false));

    // Fetch news (use company name for better results)
    const companyName = mockStock?.name ?? ticker;
    fetch(`/api/news?company=${encodeURIComponent(companyName)}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          // Sort by pubDate descending (latest first)
          const sorted = d.sort((a: NewsArticle, b: NewsArticle) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );
          setNews(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingN(false));
  }, [resolvedSymbol, ticker, mockStock?.name]);

  // Use live price if available, else mock
  const price = fundamentals?.price ?? mockStock?.price ?? 0;
  const change = fundamentals?.change ?? mockStock?.change ?? 0;
  const changePct = fundamentals?.changePct ?? mockStock?.changePct ?? 0;
  const name = fundamentals?.longName ?? mockStock?.name ?? ticker;
  const sector = fundamentals?.sector ?? mockStock?.sector ?? "";
  const symbol = resolvedSymbol ?? `${ticker}.NS`;
  const changeColor = changePct >= 0 ? "text-green-dark" : "text-red-dark";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start sm:items-center gap-3">
          <Link href="/" className="btn bg-bg px-3 py-1.5 text-sm inline-flex items-center gap-1.5 shrink-0">
            <ArrowLeft size={14} strokeWidth={3} />
            Back
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{name}</h1>
              {(sheetStock || mockStock) && (
                <SignalBadge signal={sheetStock?.signal ?? mockStock?.signal ?? "neutral"} />
              )}
            </div>
            <span className="text-sm text-fg/70 font-bold">
              {symbol} &middot; {sector}
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-3xl font-bold tabular-nums">
            ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-lg font-bold tabular-nums ${changeColor}`}>
            {changePct >= 0 ? "+" : ""}
            {change.toFixed(2)} ({changePct >= 0 ? "+" : ""}
            {changePct.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Not analysed banner */}
      {!sheetStock && !mockStock && !loadingF && (
        <div className="panel p-3 bg-yellow-light mb-5 inline-flex items-center gap-2">
          <Activity size={14} strokeWidth={3} className="text-fg/50 shrink-0" />
          <span className="text-sm font-bold text-fg/70">
            Not analysed &mdash; AI analysis not available for this stock yet. Showing live market data only.
          </span>
        </div>
      )}

      {/* Mission Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Verdict Panel — sheet data preferred, mock fallback */}
        {(sheetStock || mockStock) && (
          <div className="panel p-5 md:col-span-3 bg-yellow-light">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Target size={14} strokeWidth={3} />
              Verdict
            </h2>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-bold tabular-nums">
                {sheetStock?.score ?? mockStock?.score ?? 0}
              </span>
              <span className="text-lg text-fg/60 font-bold">/10</span>
            </div>
            <p className="text-base leading-relaxed font-semibold">
              {sheetStock?.verdict ?? mockStock?.verdict ?? ""}
            </p>

            {/* Good/Bad signals from sheet */}
            {sheetStock?.goodSignals && (
              <div className="mt-4 pt-3 border-t-2 border-fg/15 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-green-dark uppercase tracking-wider">Good Signals</span>
                  {String(sheetStock.goodSignals).split("|").map((s: string, i: number) => s.trim() && (
                    <span key={i} className="text-sm font-semibold flex items-start gap-1.5">
                      <CheckCircle size={12} strokeWidth={3} className="text-green-dark shrink-0 mt-0.5" />
                      {s.trim()}
                    </span>
                  ))}
                </div>
                {sheetStock?.badSignals && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-red-dark uppercase tracking-wider">Bad Signals</span>
                    {String(sheetStock.badSignals).split("|").map((s: string, i: number) => s.trim() && (
                      <span key={i} className="text-sm font-semibold flex items-start gap-1.5">
                        <XCircle size={12} strokeWidth={3} className="text-red-dark shrink-0 mt-0.5" />
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chart (LIVE) */}
        <div className="panel p-5 bg-cream md:col-span-3">
          <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Activity size={14} strokeWidth={3} />
            Price Chart
          </h2>
          {resolvedSymbol ? (
            <StockChart symbol={resolvedSymbol} />
          ) : (
            <div className="h-[260px] flex items-center justify-center">
              <Loader2 size={20} strokeWidth={3} className="animate-spin" />
            </div>
          )}
        </div>

        {/* If no mock/sheet stock, show quick stats */}
        {!mockStock && !sheetStock && !loadingF && fundamentals && (
          <div className="panel p-5 md:col-span-3 bg-yellow-light">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Target size={14} strokeWidth={3} />
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
              <div><span className="text-xs text-fg/60 font-bold uppercase">Market Cap</span><p className="text-lg font-bold">₹{fundamentals.marketCap}</p></div>
              <div><span className="text-xs text-fg/60 font-bold uppercase">52W High</span><p className="text-lg font-bold tabular-nums">₹{fundamentals.fiftyTwoWeekHigh.toLocaleString("en-IN")}</p></div>
              <div><span className="text-xs text-fg/60 font-bold uppercase">52W Low</span><p className="text-lg font-bold tabular-nums">₹{fundamentals.fiftyTwoWeekLow.toLocaleString("en-IN")}</p></div>
              <div><span className="text-xs text-fg/60 font-bold uppercase">Volume</span><p className="text-lg font-bold tabular-nums">{(fundamentals.volume / 1e6).toFixed(1)}M</p></div>
            </div>
          </div>
        )}

        {/* Technicals (LIVE) */}
        {loadingT ? (
          <LoadingPanel label="technicals" />
        ) : technicals ? (
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity size={14} strokeWidth={3} />
              Technicals
            </h2>
            <TechRow
              label="RSI (14)"
              value={technicals.rsi ?? "N/A"}
              good={
                technicals.rsi != null
                  ? technicals.rsi > 40 && technicals.rsi < 70
                    ? true
                    : technicals.rsi <= 30 || technicals.rsi >= 70
                      ? false
                      : null
                  : null
              }
            />
            <TechRow
              label="MACD"
              value={technicals.macd}
              good={technicals.macd === "Bullish" ? true : technicals.macd === "Bearish" ? false : null}
            />
            <TechRow label="50 DMA" value={technicals.dma50} good={technicals.dma50 === "Above"} />
            <TechRow label="200 DMA" value={technicals.dma200} good={technicals.dma200 === "Above"} />
            <TechRow
              label="Vol vs Avg"
              value={technicals.volumeVsAvg != null ? `${technicals.volumeVsAvg}x` : "N/A"}
              good={
                technicals.volumeVsAvg != null
                  ? technicals.volumeVsAvg > 1.5
                    ? true
                    : technicals.volumeVsAvg < 0.5
                      ? false
                      : null
                  : null
              }
            />
            {technicals.sma50 && (
              <TechRow label="50 DMA Price" value={`₹${technicals.sma50.toLocaleString("en-IN")}`} good={null} />
            )}
            {technicals.sma200 && (
              <TechRow label="200 DMA Price" value={`₹${technicals.sma200.toLocaleString("en-IN")}`} good={null} />
            )}
          </div>
        ) : mockStock ? (
          // Fallback to mock technicals
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity size={14} strokeWidth={3} />
              Technicals
            </h2>
            <TechRow label="RSI (14)" value={mockStock.technicals.rsi} good={mockStock.technicals.rsi > 40 && mockStock.technicals.rsi < 70 ? true : false} />
            <TechRow label="MACD" value={mockStock.technicals.macd} good={mockStock.technicals.macd === "Bullish" ? true : mockStock.technicals.macd === "Bearish" ? false : null} />
            <TechRow label="50 DMA" value={mockStock.technicals.dma50} good={mockStock.technicals.dma50 === "Above"} />
            <TechRow label="200 DMA" value={mockStock.technicals.dma200} good={mockStock.technicals.dma200 === "Above"} />
            <TechRow label="Vol vs Avg" value={`${mockStock.technicals.volumeVsAvg}x`} good={mockStock.technicals.volumeVsAvg > 1.5 ? true : null} />
          </div>
        ) : null}

        {/* Fundamentals (LIVE) */}
        {loadingF ? (
          <LoadingPanel label="fundamentals" />
        ) : fundamentals ? (
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <BarChart3 size={14} strokeWidth={3} />
              Fundamentals
            </h2>
            <TechRow
              label="P/E"
              value={fundamentals.pe != null ? `${fundamentals.pe.toFixed(1)}x` : "N/A"}
              good={fundamentals.pe != null ? (fundamentals.pe > 0 && fundamentals.pe < 25 ? true : fundamentals.pe > 50 ? false : null) : null}
            />
            <TechRow
              label="Debt/Equity"
              value={fundamentals.debtToEquity != null ? `${(fundamentals.debtToEquity / 100).toFixed(1)}` : "N/A"}
              good={fundamentals.debtToEquity != null ? (fundamentals.debtToEquity < 50 ? true : fundamentals.debtToEquity > 200 ? false : null) : null}
            />
            <TechRow label="Market Cap" value={`₹${fundamentals.marketCap}`} good={null} />
            <TechRow
              label="Promoter %"
              value={fundamentals.promoterHolding != null ? `${fundamentals.promoterHolding.toFixed(1)}%` : "N/A"}
              good={fundamentals.promoterHolding != null ? (fundamentals.promoterHolding > 50 ? true : fundamentals.promoterHolding < 25 ? false : null) : null}
            />
            <TechRow
              label="Rev Growth"
              value={fundamentals.revenueGrowth != null ? `${fundamentals.revenueGrowth > 0 ? "+" : ""}${fundamentals.revenueGrowth.toFixed(1)}%` : "N/A"}
              good={fundamentals.revenueGrowth != null ? (fundamentals.revenueGrowth > 10 ? true : fundamentals.revenueGrowth < 0 ? false : null) : null}
            />
            <TechRow
              label="ROE"
              value={fundamentals.roe != null ? `${fundamentals.roe.toFixed(1)}%` : "N/A"}
              good={fundamentals.roe != null ? (fundamentals.roe > 15 ? true : fundamentals.roe < 10 ? false : null) : null}
            />
            <TechRow
              label="Profit Margin"
              value={fundamentals.profitMargins != null ? `${fundamentals.profitMargins.toFixed(1)}%` : "N/A"}
              good={fundamentals.profitMargins != null ? (fundamentals.profitMargins > 10 ? true : fundamentals.profitMargins < 0 ? false : null) : null}
            />
          </div>
        ) : mockStock ? (
          // Fallback to mock fundamentals
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <BarChart3 size={14} strokeWidth={3} />
              Fundamentals
            </h2>
            <TechRow label="P/E" value={`${mockStock.fundamentals.pe}x`} good={null} />
            <TechRow label="Debt/Equity" value={mockStock.fundamentals.debtToEquity.toFixed(1)} good={null} />
            <TechRow label="Market Cap" value={`₹${mockStock.fundamentals.marketCap}`} good={null} />
            <TechRow label="Promoter %" value={`${mockStock.fundamentals.promoterHolding}%`} good={null} />
            <TechRow label="QoQ Rev" value={`${mockStock.fundamentals.qoqRevenue > 0 ? "+" : ""}${mockStock.fundamentals.qoqRevenue}%`} good={null} />
            <TechRow label="ROE" value={`${mockStock.fundamentals.roe}%`} good={null} />
          </div>
        ) : null}

        {/* News (LIVE) */}
        {loadingN ? (
          <LoadingPanel label="news" />
        ) : news && news.length > 0 ? (
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Newspaper size={14} strokeWidth={3} />
              Latest News
            </h2>
            <div className="flex flex-col gap-3">
              {news.slice(0, 6).map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2.5 group"
                >
                  <Newspaper size={14} strokeWidth={3} className="text-fg/40 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-snug group-hover:underline truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-fg/60 font-semibold mt-0.5 flex items-center gap-1">
                      {item.source && <span>{item.source}</span>}
                      {item.pubDate && <span>&middot; {timeAgo(item.pubDate)}</span>}
                      <ExternalLink size={10} strokeWidth={3} className="inline" />
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : mockStock ? (
          // Fallback to mock news
          <div className="panel p-5 bg-cream">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Newspaper size={14} strokeWidth={3} />
              News & Sentiment
            </h2>
            <div className="flex flex-col gap-3">
              {mockStock.news.map((item, i) => {
                const Icon = item.sentiment === "bullish" ? TrendingUp : item.sentiment === "bearish" ? TrendingDown : Minus;
                const color = item.sentiment === "bullish" ? "text-green-dark" : item.sentiment === "bearish" ? "text-red-dark" : "text-fg/60";
                return (
                  <div key={i} className="flex gap-2.5">
                    <Icon size={16} strokeWidth={3} className={`${color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-sm font-bold leading-snug">{item.title}</p>
                      <p className="text-xs text-fg/60 font-semibold mt-0.5">&mdash; {item.source}, {item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* AI Analyst Predictions (from sheet) */}
        {analystData && (() => {
          // Derive Buy/Sell/Hold counts from bull + bear signals
          const bullSig = (analystData.bullSignal ?? "").toUpperCase();
          const bearSig = (analystData.bearSignal ?? "").toUpperCase();
          let buyCount = 0, sellCount = 0, holdCount = 0;
          // Bull analyst vote
          if (bullSig.includes("BUY")) buyCount++;
          else if (bullSig.includes("SELL")) sellCount++;
          else holdCount++;
          // Bear analyst vote
          if (bearSig.includes("BUY")) buyCount++;
          else if (bearSig.includes("SELL")) sellCount++;
          else holdCount++;
          // Consensus vote as tiebreaker
          const cons = (analystData.consensus ?? "").toUpperCase();
          if (cons.includes("BUY")) buyCount++;
          else if (cons.includes("SELL")) sellCount++;
          else holdCount++;

          return (
          <div className="panel p-5 bg-cream md:col-span-3">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Users size={14} strokeWidth={3} />
              AI Analyst Predictions
            </h2>

            {/* Consensus + tally */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-sm font-bold text-fg/60">Consensus:</span>
              <SignalBadge signal={analystData.consensus ?? "hold"} />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-fg/30 bg-green/60">
                  <TrendingUp size={10} strokeWidth={3} />Buy:{buyCount}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-fg/30 bg-red/60">
                  <TrendingDown size={10} strokeWidth={3} />Sell:{sellCount}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-fg/30 bg-fg/10">
                  <Minus size={10} strokeWidth={3} />Hold:{holdCount}
                </span>
              </div>
            </div>

            {/* Price targets grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div className="panel p-3 bg-green/50">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Bull 1M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.bull1mTarget}</p>
                <span className="text-xs font-bold text-fg/50">{analystData.bullSignal} &middot; {analystData.bullConviction}</span>
              </div>
              <div className="panel p-3 bg-red/50">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Bear 1M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.bear1mTarget}</p>
                <span className="text-xs font-bold text-fg/50">{analystData.bearSignal} &middot; {analystData.bearConviction}</span>
              </div>
              <div className="panel p-3 bg-yellow-light">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Avg 1M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.avg1mTarget}</p>
              </div>
              <div className="panel p-3 bg-green/50">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Bull 3M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.bull3mTarget}</p>
              </div>
              <div className="panel p-3 bg-red/50">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Bear 3M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.bear3mTarget}</p>
              </div>
              <div className="panel p-3 bg-yellow-light">
                <span className="text-[10px] font-bold text-fg/60 uppercase tracking-wider">Avg 3M Target</span>
                <p className="text-lg font-bold tabular-nums">₹{analystData.avg3mTarget}</p>
              </div>
            </div>

            {/* Catalysts vs Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analystData.bullCatalysts && (
                <div>
                  <span className="text-xs font-bold text-green-dark uppercase tracking-wider">Bull Catalysts</span>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {String(analystData.bullCatalysts).split("|").map((c, i) => c.trim() && (
                      <span key={i} className="text-sm font-semibold flex items-start gap-1.5">
                        <TrendingUp size={12} strokeWidth={3} className="text-green-dark shrink-0 mt-0.5" />
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analystData.bearRisks && (
                <div>
                  <span className="text-xs font-bold text-red-dark uppercase tracking-wider">Bear Risks</span>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {String(analystData.bearRisks).split("|").map((r, i) => r.trim() && (
                      <span key={i} className="text-sm font-semibold flex items-start gap-1.5">
                        <TrendingDown size={12} strokeWidth={3} className="text-red-dark shrink-0 mt-0.5" />
                        {r.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* Signals Timeline (hardcoded from mock) */}
        {mockStock && (
          <div className="panel p-5 bg-cream md:col-span-3">
            <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Clock size={14} strokeWidth={3} />
              Signals Timeline
            </h2>
            <div className="flex flex-col gap-2.5">
              {mockStock.signals.map((sig, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-fg/60 font-bold w-14 shrink-0 tabular-nums">{sig.date}</span>
                  <CircleDot size={10} strokeWidth={3} className="shrink-0" />
                  <span className="text-sm font-semibold">{sig.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
