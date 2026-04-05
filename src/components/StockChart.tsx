"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, type CandlestickData, type Time, ColorType } from "lightweight-charts";
import { Loader2 } from "lucide-react";

const RANGE_OPTIONS = [
  { label: "1D", range: "7d", interval: "5m", intraday: true },
  { label: "1W", range: "5d", interval: "15m", intraday: true },
  { label: "1M", range: "1mo", interval: "1d", intraday: false },
  { label: "3M", range: "3mo", interval: "1d", intraday: false },
  { label: "1Y", range: "1y", interval: "1d", intraday: false },
];

type Props = {
  symbol: string; // e.g. TATAMOTORS.NS
};

export default function StockChart({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [activeRange, setActiveRange] = useState(2); // default 1M
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0E1223" },
        textColor: "#94A3B8",
        fontFamily: "Space Grotesk, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: "#33415520" },
        horzLines: { color: "#33415520" },
      },
      width: containerRef.current.clientWidth,
      height: 260,
      timeScale: {
        borderColor: "#33415540",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#33415540",
      },
      crosshair: {
        vertLine: { color: "#94A3B840", width: 1, style: 2 },
        horzLine: { color: "#94A3B840", width: 1, style: 2 },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderUpColor: "#475569",
      borderDownColor: "#475569",
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { range, interval, intraday } = RANGE_OPTIONS[activeRange];
      try {
        const res = await fetch(
          `/api/chart?symbol=${encodeURIComponent(symbol)}&range=${range}&interval=${interval}`
        );
        const json = await res.json();
        if (seriesRef.current && json.data?.length > 0) {
          let pointsToUse = json.data;

          // For "1D", only show the last trading day's data
          if (activeRange === 0 && intraday) {
            const lastDate = pointsToUse[pointsToUse.length - 1].time.split(" ")[0];
            pointsToUse = pointsToUse.filter((d: { time: string }) => d.time.startsWith(lastDate));
          }

          const chartData: CandlestickData<Time>[] = pointsToUse.map(
            (d: { time: string; open: number; high: number; low: number; close: number }) => ({
              // Intraday needs Unix timestamp; daily uses YYYY-MM-DD string
              time: (intraday
                ? Math.floor(new Date(d.time.replace(" ", "T") + ":00+05:30").getTime() / 1000)
                : d.time) as Time,
              open: d.open,
              high: d.high,
              low: d.low,
              close: d.close,
            })
          );
          seriesRef.current.setData(chartData);
          chartRef.current?.timeScale().fitContent();
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [symbol, activeRange]);

  return (
    <div>
      <div className="relative">
        <div ref={containerRef} className="w-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/90">
            <Loader2 size={20} strokeWidth={3} className="animate-spin" />
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        {RANGE_OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setActiveRange(i)}
            className={`btn px-2.5 py-1 text-xs ${
              activeRange === i ? "bg-yellow" : "bg-cream"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
