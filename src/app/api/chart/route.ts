import { NextRequest, NextResponse } from "next/server";
import { getChartData } from "@/lib/yahoo";
import { computeTechnicals } from "@/lib/technicals";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const range = req.nextUrl.searchParams.get("range") ?? "3mo";
  const interval = req.nextUrl.searchParams.get("interval") ?? "1d";
  const withTechnicals = req.nextUrl.searchParams.get("technicals") === "1";

  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }

  const cacheKey = `chart:${symbol}:${range}:${interval}:${withTechnicals}`;
  const isIntraday = ["1d", "5d"].includes(range);
  const ttl = isIntraday ? 60_000 : 3600_000; // 60s for intraday, 1h for daily+

  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const { meta, data } = await getChartData(symbol, range, interval);

    let technicals = null;
    if (withTechnicals && data.length > 0) {
      const closes = data.map((d) => d.close);
      const volumes = data.map((d) => d.volume);
      const currentPrice = closes[closes.length - 1];
      technicals = computeTechnicals(
        closes,
        volumes,
        currentPrice,
        meta.fiftyDayAverage as number | undefined,
        meta.twoHundredDayAverage as number | undefined
      );
    }

    const result = { meta, data, technicals };
    setCache(cacheKey, result, ttl);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch chart" }, { status: 500 });
  }
}
