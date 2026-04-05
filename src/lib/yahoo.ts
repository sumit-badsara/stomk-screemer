import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// --- Public API ---

export async function resolveSymbol(ticker: string): Promise<string> {
  if (ticker.endsWith(".NS") || ticker.endsWith(".BO")) return ticker;
  const results = await searchStocks(ticker);
  const nsResult = results.find((r) => r.symbol.endsWith(".NS"));
  if (nsResult) return nsResult.symbol;
  if (results.length > 0) return results[0].symbol;
  return `${ticker}.NS`;
}

export async function searchStocks(
  query: string
): Promise<{ symbol: string; name: string; exchange: string; sector: string }[]> {
  const res = await yf.search(query, { region: "IN", quotesCount: 8, newsCount: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.quotes ?? [])
    .filter((q: any) => {
      return (
        q.typeDisp === "equity" &&
        q.symbol &&
        (q.symbol.endsWith(".NS") || q.symbol.endsWith(".BO"))
      );
    })
    .map((q: any) => ({
      symbol: String(q.symbol ?? ""),
      name: String(q.longname || q.shortname || q.symbol || ""),
      exchange: String(q.exchDisp || q.exchange || ""),
      sector: String(q.sector || ""),
    }));
}

export type ChartDataPoint = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function rangeToDays(range: string): number {
  const map: Record<string, number> = {
    "1d": 1, "3d": 3, "5d": 5, "7d": 7, "1mo": 30, "3mo": 90, "6mo": 180, "1y": 365, "2y": 730, "5y": 1825,
  };
  return map[range] ?? 90;
}

export async function getChartData(
  symbol: string,
  range = "3mo",
  interval = "1d"
): Promise<{ meta: Record<string, unknown>; data: ChartDataPoint[] }> {
  const isIntraday = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h"].includes(interval);
  const period1 = new Date();
  period1.setDate(period1.getDate() - rangeToDays(range));

  const res = await yf.chart(symbol, {
    period1,
    interval: interval as "1d",
  });

  const meta: Record<string, unknown> = {
    regularMarketPrice: res.meta?.regularMarketPrice,
    chartPreviousClose: res.meta?.chartPreviousClose,
    fiftyTwoWeekHigh: res.meta?.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: res.meta?.fiftyTwoWeekLow,
    fiftyDayAverage: (res.meta as Record<string, unknown>)?.fiftyDayAverage,
    twoHundredDayAverage: (res.meta as Record<string, unknown>)?.twoHundredDayAverage,
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quotes = (res as any).quotes ?? [];
  const data: ChartDataPoint[] = quotes
    .filter((q: any) => q.open != null && q.close != null)
    .map((q: any) => {
      const d = new Date(q.date);
      const time = isIntraday
        ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
        : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      return {
        time,
        open: q.open!,
        high: q.high!,
        low: q.low!,
        close: q.close!,
        volume: q.volume ?? 0,
      };
    });

  return { meta, data };
}

export type Fundamentals = {
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

function formatMarketCap(val: number): string {
  if (val >= 1e12) return `${(val / 1e12).toFixed(1)}L Cr`;
  if (val >= 1e10) return `${(val / 1e10).toFixed(0)}K Cr`;
  if (val >= 1e7) return `${(val / 1e7).toFixed(0)} Cr`;
  return val.toLocaleString("en-IN");
}

export async function getFundamentals(symbol: string): Promise<Fundamentals | null> {
  const res = await yf.quoteSummary(symbol, {
    modules: [
      "price",
      "summaryDetail",
      "defaultKeyStatistics",
      "financialData",
      "majorHoldersBreakdown",
      "assetProfile",
    ],
  });

  const price = res.price;
  const summary = res.summaryDetail;
  const financial = res.financialData;
  const holders = res.majorHoldersBreakdown;
  const profile = res.assetProfile;
  const keyStats = res.defaultKeyStatistics;

  if (!price) return null;

  const mktPrice = price.regularMarketPrice ?? 0;
  const prevClose = price.regularMarketPreviousClose ?? 0;
  const mktCap = price.marketCap ?? 0;

  return {
    price: mktPrice,
    change: mktPrice - prevClose,
    changePct: prevClose ? ((mktPrice - prevClose) / prevClose) * 100 : 0,
    marketCap: formatMarketCap(mktCap),
    pe: summary?.trailingPE ?? null,
    forwardPE: summary?.forwardPE ?? keyStats?.forwardPE ?? null,
    dividendYield: summary?.dividendYield ?? null,
    fiftyTwoWeekHigh: summary?.fiftyTwoWeekHigh ?? 0,
    fiftyTwoWeekLow: summary?.fiftyTwoWeekLow ?? 0,
    fiftyDayAvg: summary?.fiftyDayAverage ?? 0,
    twoHundredDayAvg: summary?.twoHundredDayAverage ?? 0,
    debtToEquity: financial?.debtToEquity ?? null,
    revenueGrowth: financial?.revenueGrowth != null ? financial.revenueGrowth * 100 : null,
    profitMargins: financial?.profitMargins != null ? financial.profitMargins * 100 : null,
    roe: financial?.returnOnEquity != null ? financial.returnOnEquity * 100 : null,
    promoterHolding: holders?.insidersPercentHeld != null ? holders.insidersPercentHeld * 100 : null,
    sector: profile?.sector ?? "",
    industry: profile?.industry ?? "",
    longName: price.longName ?? price.shortName ?? symbol,
    volume: price.regularMarketVolume ?? 0,
    avgVolume: summary?.averageVolume ?? price.averageDailyVolume3Month ?? 0,
  };
}

export type NewsArticle = {
  title: string;
  source: string;
  pubDate: string;
  link: string;
};

export async function getNews(companyName: string): Promise<NewsArticle[]> {
  // Google News RSS — no auth needed, max ~100 results
  const query = encodeURIComponent(`${companyName} stock NSE`);
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  const xml = await res.text();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const items: NewsArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title =
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() ?? "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const source =
      block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() ?? "";

    if (!title || !pubDate) continue;

    // Filter: only keep articles from the last 1 year
    const articleDate = new Date(pubDate);
    if (articleDate < oneYearAgo) continue;

    items.push({ title, source, pubDate, link });
  }

  // Sort latest first
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return items;
}
