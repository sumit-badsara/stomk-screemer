"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ScanSearch,
  Zap,
  Brain,
  Newspaper,
  Activity,
  Loader2,
} from "lucide-react";

// --- Types ---

type SectorOverview = {
  sector: string;
  strength: number;
  stockCount: number;
  topStock: string;
  topScore: number;
  sectorOutlook: string;
};

type SheetStock = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  signal: string;
  score: number;
  tagline: string;
  goodSignals: string;
  badSignals: string;
};

// --- Hero ---

function Hero() {
  return (
    <section className="bg-yellow-light border-b-[4px] border-fg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left — text */}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            AI-powered Indian
            <br />
            stock <span className="text-green-dark">screener</span>
          </h2>
          <p className="text-base sm:text-lg text-fg/70 font-semibold leading-relaxed mb-6 max-w-md">
            Claude AI analyzes Nifty 50 stocks daily — technicals, fundamentals,
            news sentiment — then bull &amp; bear analysts debate every pick.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/stocks"
              className="btn bg-yellow px-5 py-2.5 text-sm inline-flex items-center gap-2"
            >
              <BarChart3 size={16} strokeWidth={3} />
              View Top Stocks
            </Link>
            <a
              href="#sectors"
              className="btn bg-bg px-5 py-2.5 text-sm inline-flex items-center gap-2"
            >
              <Layers size={16} strokeWidth={3} />
              Sector Analysis
            </a>
          </div>
        </div>

        {/* Right — diagram */}
        <div className="flex-1 max-w-sm w-full">
          <div className="panel bg-cream p-5">
            <p className="text-[10px] font-bold text-fg/50 uppercase tracking-widest mb-3">
              How it works
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  Icon: Activity,
                  label: "Fetch live data",
                  desc: "Prices, technicals, fundamentals",
                },
                {
                  Icon: Newspaper,
                  label: "Scan news",
                  desc: "Google News RSS, sector trends",
                },
                {
                  Icon: Brain,
                  label: "AI analysis",
                  desc: "10 sector agents score every stock",
                },
                {
                  Icon: Zap,
                  label: "Bull vs Bear debate",
                  desc: "20 analysts argue price targets",
                },
                {
                  Icon: ScanSearch,
                  label: "Final ratings",
                  desc: "Score, signals, consensus verdict",
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow flex items-center justify-center border-[3px] border-fg shrink-0">
                    <step.Icon size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="text-sm font-bold">{step.label}</span>
                    <p className="text-xs text-fg/60 font-semibold">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Sector Bar Chart ---

function SectorBarChart({
  sectors,
  selected,
  onSelect,
}: {
  sectors: SectorOverview[];
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {sectors.map((s) => {
        const pct = (s.strength / 10) * 100;
        const color =
          s.strength >= 7
            ? "bg-green-dark"
            : s.strength >= 5
              ? "bg-yellow"
              : "bg-red-dark";
        const isSelected = selected === s.sector;

        return (
          <button
            key={s.sector}
            onClick={() => onSelect(s.sector)}
            className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
              isSelected ? "bg-fg/5" : "hover:bg-fg/5"
            }`}
          >
            <span
              className={`text-sm font-bold w-[130px] sm:w-[170px] text-left shrink-0 truncate ${
                isSelected ? "text-fg" : "text-fg/70"
              }`}
            >
              {s.sector}
            </span>
            <div className="flex-1 h-5 bg-fg/5 rounded-full overflow-hidden border-2 border-fg/15">
              <div
                className={`h-full ${color} rounded-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums w-10 text-right shrink-0">
              {s.strength}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// --- Sector Detail ---

function SectorDetail({
  sector,
  stocks,
}: {
  sector: SectorOverview;
  stocks: SheetStock[];
}) {
  const sectorStocks = stocks
    .filter(
      (s) => s.sector?.toLowerCase() === sector.sector?.toLowerCase()
    )
    .sort((a, b) => Number(b.score) - Number(a.score));

  return (
    <div className="panel p-5 bg-cream lg:h-full lg:max-h-[520px] flex flex-col">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="text-lg font-bold">{sector.sector}</h3>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border-[3px] border-fg ${
            sector.strength >= 7
              ? "bg-green"
              : sector.strength >= 5
                ? "bg-yellow-light"
                : "bg-red"
          }`}
        >
          {sector.strength}/10
        </span>
      </div>

      {sector.sectorOutlook && (
        <p className="text-sm text-fg/70 font-semibold leading-relaxed mb-4 shrink-0 line-clamp-4">
          {sector.sectorOutlook}
        </p>
      )}

      {sectorStocks.length > 0 && (
        <div className="border-t-2 border-fg/10 pt-3 flex-1 min-h-0 flex flex-col">
          <p className="text-xs font-bold text-fg/50 uppercase tracking-widest mb-2 shrink-0">
            Stocks in sector ({sectorStocks.length})
          </p>
          <div className="flex flex-col gap-2 overflow-y-auto flex-1">
            {sectorStocks.map((s) => {
              const raw = String(s.signal).toUpperCase();
              const isBuy = raw.includes("BUY") || raw.includes("BULLISH");
              const isSell = raw.includes("SELL") || raw.includes("BEARISH");
              const signalColor = isBuy ? "text-green-dark" : isSell ? "text-red-dark" : "text-fg/50";
              const SignalIcon = isBuy ? TrendingUp : isSell ? TrendingDown : Minus;
              const changePct = Number(s.changePct);

              return (
                <Link
                  key={s.ticker}
                  href={`/stock/${s.ticker}`}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-fg/5 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SignalIcon
                      size={14}
                      strokeWidth={3}
                      className={`${signalColor} shrink-0`}
                    />
                    <span className="text-sm font-bold truncate">
                      {s.ticker}
                    </span>
                    <span className="text-xs text-fg/50 font-semibold hidden sm:inline">
                      {s.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold tabular-nums">
                      {Number(s.score).toFixed(1)}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        changePct >= 0 ? "text-green-dark" : "text-red-dark"
                      }`}
                    >
                      {changePct >= 0 ? "+" : ""}
                      {changePct.toFixed(1)}%
                    </span>
                    <ArrowRight size={12} strokeWidth={3} className="text-fg/30" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Page ---

export default function Home() {
  const [sectors, setSectors] = useState<SectorOverview[]>([]);
  const [allStocks, setAllStocks] = useState<SheetStock[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stocks?tab=Sector+Overview").then((r) => r.json()),
      fetch("/api/stocks?tab=Daily").then((r) => r.json()),
    ])
      .then(([sectorData, dailyData]) => {
        if (sectorData.data?.length > 0) {
          const s = sectorData.data.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (r: any): SectorOverview => ({
              sector: r.sector ?? "",
              strength: Number(r.strength) || 5,
              stockCount: Number(r.stockCount) || 0,
              topStock: r.topStock ?? "",
              topScore: Number(r.topScore) || 0,
              sectorOutlook: r.sectorOutlook ?? "",
            })
          );
          s.sort(
            (a: SectorOverview, b: SectorOverview) => b.strength - a.strength
          );
          setSectors(s);
          setSelectedSector(s[0]?.sector ?? null);
        }
        if (dailyData.data?.length > 0) {
          setAllStocks(dailyData.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSector = sectors.find((s) => s.sector === selectedSector) ?? null;

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* Sector Analysis */}
      <section id="sectors" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xs font-bold text-fg/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Layers size={14} strokeWidth={3} />
          Sector Analysis
        </h2>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <Loader2 size={20} strokeWidth={3} className="animate-spin" />
            <span className="text-sm font-bold text-fg/50">
              Loading sectors...
            </span>
          </div>
        ) : sectors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Bar chart — 3 cols, stretches to match right */}
            <div className="lg:col-span-3 panel p-4 sm:p-5 bg-cream">
              <p className="text-xs font-bold text-fg/50 uppercase tracking-widest mb-3">
                Strength comparison
              </p>
              <SectorBarChart
                sectors={sectors}
                selected={selectedSector}
                onSelect={setSelectedSector}
              />
            </div>

            {/* Sector detail — 2 cols, fixed max height, scrollable */}
            <div className="lg:col-span-2">
              {activeSector ? (
                <SectorDetail sector={activeSector} stocks={allStocks} />
              ) : (
                <div className="panel p-5 bg-cream flex items-center justify-center h-full">
                  <span className="text-sm font-bold text-fg/40">
                    Select a sector
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="panel p-8 bg-cream text-center">
            <p className="text-sm font-bold text-fg/50 mb-3">
              No sector data yet
            </p>
            <p className="text-xs text-fg/40 font-semibold">
              Run the analysis script to populate:{" "}
              <code className="bg-fg/10 px-1.5 py-0.5 rounded">
                node scripts/analyze.mjs
              </code>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
